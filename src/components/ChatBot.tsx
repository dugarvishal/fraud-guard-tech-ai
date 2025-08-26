import { useState, useEffect, useRef } from "react";
import { X, Send, Bot, User, Mic, MicOff, Volume2 } from "lucide-react";
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
      
      // Check keyword matches
      const queryWords = query.toLowerCase().split(/\s+/);
      const keywordMatches = entry.keywords.filter(keyword => 
        queryWords.some(word => word.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(word))
      );
      const keywordScore = keywordMatches.length / entry.keywords.length;
      
      // Combined confidence score
      const confidence = (questionSimilarity * 0.7) + (keywordScore * 0.3);
      
      if (confidence >= entry.confidence_threshold && 
          (!bestMatch || confidence > bestMatch.confidence)) {
        bestMatch = { entry, confidence };
      }
    }
    
    return bestMatch;
  };

  const generateContextualResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Context-aware responses based on common patterns
    if (lowerQuery.includes("risk") && lowerQuery.includes("score")) {
      return "Risk scores help you understand threat levels: 0-30 is Low Risk (Legit), 31-70 is Medium Risk (Suspicious), and 71-100 is High Risk (Fraudulent). The score is calculated using multiple AI analysis factors including domain reputation, content analysis, and pattern matching.";
    }
    
    if (lowerQuery.includes("phishing") || lowerQuery.includes("scam")) {
      return "To protect against phishing: 1) Verify sender identity before clicking links, 2) Check URLs carefully - look for misspellings or suspicious domains, 3) Never enter personal information on unsecured sites, 4) Use two-factor authentication when available, 5) Report suspicious emails to authorities.";
    }
    
    if (lowerQuery.includes("submit") || lowerQuery.includes("analyze")) {
      return "To analyze a URL: 1) Go to the Submit page, 2) Paste the suspicious URL or upload a file, 3) Click 'Analyze for Threats', 4) Wait for our AI to process it, 5) Review the detailed security report with risk scores and recommendations.";
    }
    
    if (lowerQuery.includes("education") || lowerQuery.includes("learn")) {
      return "Our Education section offers comprehensive security guides covering phishing detection, fake apps, social engineering, financial fraud, and privacy basics. Each module includes interactive checklists and quizzes to test your knowledge.";
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
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
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
                onClick={() => setInputValue("How do I use the fraud detection tool?")}
                disabled={isLoading}
              >
                How to use this tool?
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