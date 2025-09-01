import { useState, useEffect, useRef } from "react";
import { X, Send, Bot, User, Mic, MicOff, Volume2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  intent?: string;
  confidence?: number;
}

interface ChatBotProps {
  onClose: () => void;
}

interface KnowledgeEntry {
  question: string;
  answer: string;
  intent: string;
  category: string;
  keywords: string[];
  confidence_threshold: number;
}

// Speech Recognition type declarations
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

const ChatBot = ({ onClose }: ChatBotProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI security assistant. I can help you with fraud detection, explain analysis results, and provide security guidance. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeEntry[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchKnowledgeBase();
    initializeSpeechRecognition();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }, 100);
  }, [messages]);

  const fetchKnowledgeBase = async () => {
    const { data, error } = await supabase
      .from("chatbot_knowledge")
      .select("*");
    
    if (error) {
      console.error("Error fetching knowledge base:", error);
      return;
    }
    
    setKnowledgeBase(data || []);
  };

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Could not process voice input. Please try typing instead.",
          variant: "destructive",
        });
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  };

  const calculateSimilarity = (text1: string, text2: string): number => {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  };

  const findBestMatch = (query: string): { entry: KnowledgeEntry; confidence: number } | null => {
    let bestMatch: { entry: KnowledgeEntry; confidence: number } | null = null;
    
    for (const entry of knowledgeBase) {
      // Check direct question similarity
      const questionSimilarity = calculateSimilarity(query, entry.question);
      
      // Enhanced keyword matching with partial matches and context
      const queryWords = query.toLowerCase().split(/\s+/);
      let keywordScore = 0;
      let matchedKeywords = 0;
      
      for (const keyword of entry.keywords) {
        const keywordLower = keyword.toLowerCase();
        const queryLower = query.toLowerCase();
        
        if (queryLower.includes(keywordLower)) {
          keywordScore += 0.3; // Full keyword match
          matchedKeywords++;
        } else if (keywordLower.includes(queryLower) || queryWords.some(word => 
          keywordLower.includes(word) || word.includes(keywordLower.slice(0, -1)))) {
          keywordScore += 0.15; // Partial keyword match
          matchedKeywords++;
        }
        
        // Boost for security-related terms
        if (['phishing', 'malware', 'fraud', 'security', 'attack', 'threat', 'scam', 'password', 'crypto'].some(term => 
          keywordLower.includes(term) && queryLower.includes(term))) {
          keywordScore += 0.2;
        }
      }
      
      // Normalize keyword score
      if (entry.keywords.length > 0) {
        keywordScore = keywordScore / entry.keywords.length;
      }
      
      // Boost for question similarity in cybersecurity context
      let contextBoost = 0;
      if (entry.category === 'security' && query.toLowerCase().includes('how')) {
        contextBoost = 0.1;
      }
      
      // Combined confidence score with lower threshold for better matching
      const confidence = (questionSimilarity * 0.6) + (keywordScore * 0.3) + contextBoost;
      
      // Use a lower threshold multiplier for better recall
      const adjustedThreshold = entry.confidence_threshold * 0.6;
      
      if (confidence >= adjustedThreshold && 
          (!bestMatch || confidence > bestMatch.confidence)) {
        bestMatch = { entry, confidence };
      }
    }
    
    return bestMatch;
  };

  const generateContextualResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // URL analysis context
    if (lowerQuery.includes('url') || lowerQuery.includes('link') || lowerQuery.includes('website')) {
      return "I can help you analyze URLs for security threats! Our AI-powered system checks for phishing, malware, and other suspicious activities. You can submit URLs through our main scanning interface or use batch upload for multiple URLs. We also provide real-time alerts and detailed threat analysis reports.";
    }
    
    // Risk score context
    if (lowerQuery.includes("risk") && lowerQuery.includes("score")) {
      return "Risk scores help you understand threat levels: 0-30 is Low Risk (Legit), 31-70 is Medium Risk (Suspicious), and 71-100 is High Risk (Fraudulent). The score is calculated using multiple AI analysis factors including domain reputation, content analysis, and pattern matching.";
    }
    
    // Phishing detection context
    if (lowerQuery.includes('phishing') || lowerQuery.includes('fake website') || lowerQuery.includes('suspicious email')) {
      return "Phishing is one of the most common cyber threats. Look for: suspicious sender addresses, urgent language, unexpected attachments, mismatched URLs, and requests for personal information. Always verify sender identity through separate channels before taking action. Our platform can help analyze suspicious URLs and emails.";
    }
    
    // Malware and virus context
    if (lowerQuery.includes('malware') || lowerQuery.includes('virus') || lowerQuery.includes('trojan') || lowerQuery.includes('ransomware')) {
      return "Malware protection requires a multi-layered approach: keep antivirus updated, avoid suspicious downloads, enable automatic updates, use application whitelisting, and maintain regular backups. Signs of infection include slow performance, unusual network activity, and unauthorized changes to files.";
    }
    
    // Password security context
    if (lowerQuery.includes('password') || lowerQuery.includes('login') || lowerQuery.includes('authentication')) {
      return "Strong password security is essential: use unique passwords for each account (12+ characters with mixed case, numbers, symbols), enable multi-factor authentication wherever possible, consider using a reputable password manager, and never reuse passwords across multiple sites.";
    }
    
    // Social engineering context
    if (lowerQuery.includes('social engineering') || lowerQuery.includes('scam') || lowerQuery.includes('fraud')) {
      return "Social engineering attacks exploit human psychology rather than technical vulnerabilities. Be wary of: unsolicited contact requesting information, urgency tactics, authority impersonation, and too-good-to-be-true offers. Always verify requests through official channels and trust your instincts.";
    }
    
    // Mobile security context
    if (lowerQuery.includes('mobile') || lowerQuery.includes('phone') || lowerQuery.includes('app')) {
      return "Mobile security best practices: download apps only from official stores, review app permissions carefully, keep your OS updated, use device encryption and lock screens, avoid public WiFi for sensitive activities, and enable remote wipe capabilities.";
    }
    
    // Network security context
    if (lowerQuery.includes('wifi') || lowerQuery.includes('network') || lowerQuery.includes('router')) {
      return "Network security essentials: use WPA3 encryption, change default router passwords, enable firewalls, set up guest networks, monitor connected devices, avoid public WiFi for sensitive activities, and consider using a VPN for added protection.";
    }
    
    // Data protection context
    if (lowerQuery.includes('data') || lowerQuery.includes('backup') || lowerQuery.includes('privacy')) {
      return "Data protection strategy should include: regular automated backups (follow 3-2-1 rule), encryption for sensitive data, privacy settings review, limit data sharing, monitor account activity, and understand your rights under regulations like GDPR and CCPA.";
    }
    
    // General security advice
    if (lowerQuery.includes('secure') || lowerQuery.includes('safety') || lowerQuery.includes('protect')) {
      return "Comprehensive security requires multiple layers: strong authentication (2FA/MFA), regular software updates, security awareness, backup strategies, network protection, and staying informed about current threats. What specific security area would you like to focus on?";
    }
    
    // Real-time alerts context
    if (lowerQuery.includes('alert') || lowerQuery.includes('notification') || lowerQuery.includes('warning')) {
      return "Our platform provides intelligent real-time security alerts with risk scoring, threat categorization, and actionable remediation steps. Alerts include phishing detection, malware identification, and suspicious activity monitoring. You can customize alert preferences in your dashboard.";
    }
    
    // Compliance and regulations
    if (lowerQuery.includes('compliance') || lowerQuery.includes('gdpr') || lowerQuery.includes('regulation')) {
      return "Security compliance involves meeting various regulatory requirements like GDPR, CCPA, HIPAA, and PCI DSS. Key elements include data protection policies, breach notification procedures, user consent management, data minimization, and regular security audits.";
    }
    
    // Cryptocurrency security
    if (lowerQuery.includes('crypto') || lowerQuery.includes('bitcoin') || lowerQuery.includes('wallet')) {
      return "Cryptocurrency security is critical: use hardware wallets for large amounts, secure seed phrases offline, enable 2FA on exchanges, verify transaction addresses carefully, avoid guaranteed return schemes, and stay informed about common crypto scams and fraud tactics.";
    }
    
    // Education and learning
    if (lowerQuery.includes("education") || lowerQuery.includes("learn")) {
      return "Our Education section offers comprehensive security guides covering phishing detection, fake apps, social engineering, financial fraud, and privacy basics. Each module includes interactive checklists and quizzes to test your knowledge.";
    }
    
    // Submit and analyze
    if (lowerQuery.includes("submit") || lowerQuery.includes("analyze")) {
      return "To analyze a URL: 1) Go to the Submit page, 2) Paste the suspicious URL or upload a file, 3) Click 'Analyze for Threats', 4) Wait for our AI to process it, 5) Review the detailed security report with risk scores and recommendations.";
    }
    
    return null;
  };

  const processMessage = async (userMessage: string) => {
    setIsLoading(true);
    
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      content: userMessage,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    
    // Find best response
    let response = "I'm sorry, I don't have specific information about that. Could you try rephrasing your question or ask about fraud detection, security analysis, or educational content?";
    let intent = "unknown";
    let confidence = 0;
    
    // Try knowledge base first
    const bestMatch = findBestMatch(userMessage);
    if (bestMatch) {
      response = bestMatch.entry.answer;
      intent = bestMatch.entry.intent;
      confidence = bestMatch.confidence;
    } else {
      // Try contextual response
      const contextualResponse = generateContextualResponse(userMessage);
      if (contextualResponse) {
        response = contextualResponse;
        intent = "contextual";
        confidence = 0.8;
      }
    }
    
    // Add bot response
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      content: response,
      isUser: false,
      timestamp: new Date(),
      intent,
      confidence,
    };
    
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
    
    // Text-to-speech for accessibility (optional)
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      // Uncomment to enable auto-speech:
      // speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      processMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input. Please type your message.",
        variant: "destructive",
      });
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const speakMessage = (content: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const scrollToTop = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            AI Security Assistant
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="relative flex-1">
            <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
              {/* Scroll controls */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
                  onClick={scrollToTop}
                  title="Scroll to top"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
                  onClick={scrollToBottom}
                  title="Scroll to bottom"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!message.isUser && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.isUser ? 'order-first' : ''}`}>
                    <div
                      className={`rounded-lg p-3 ${
                        message.isUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {message.content}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                      
                      {message.intent && message.intent !== "unknown" && (
                        <Badge variant="outline" className="text-xs">
                          {message.intent}
                        </Badge>
                      )}
                      
                      {message.confidence && (
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(message.confidence * 100)}%
                        </Badge>
                      )}
                      
                      {!message.isUser && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => speakMessage(message.content)}
                          title="Read aloud"
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {message.isUser && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary animate-pulse" />
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            </ScrollArea>
          </div>
          
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about fraud detection, security, or site features..."
                disabled={isLoading}
                className="flex-1"
              />
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleVoiceInput}
                disabled={isLoading}
                className={isListening ? "bg-destructive text-destructive-foreground" : ""}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button type="submit" disabled={!inputValue.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputValue("How do I check if a URL is safe?")}
                disabled={isLoading}
              >
                URL Safety
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputValue("What are advanced phishing techniques?")}
                disabled={isLoading}
              >
                Phishing Detection
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputValue("How do I identify malware indicators?")}
                disabled={isLoading}
              >
                Malware Analysis
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputValue("What makes a strong password policy?")}
                disabled={isLoading}
              >
                Password Security
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputValue("What steps should I take during a security incident?")}
                disabled={isLoading}
              >
                Incident Response
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputValue("How can I protect against financial fraud online?")}
                disabled={isLoading}
              >
                Financial Security
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputValue("What does my risk score mean?")}
                disabled={isLoading}
              >
                Risk score meaning
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputValue("How can I protect myself from phishing?")}
                disabled={isLoading}
              >
                Phishing protection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;