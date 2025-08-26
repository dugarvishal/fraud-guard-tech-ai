import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { Bot, MessageCircle, Zap, Shield } from "lucide-react";

const Assistant = () => {
  const [isChatOpen, setChatOpen] = useState(true);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-hero">
                <Bot className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground">AI Security Assistant</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get instant help with fraud detection, security analysis, and protection strategies. 
              Our AI assistant is trained on the latest security knowledge.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3 p-6 rounded-lg border bg-card">
              <div className="flex justify-center">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold">Instant Answers</h3>
              <p className="text-sm text-muted-foreground">
                Get immediate responses to your security questions and concerns
              </p>
            </div>
            
            <div className="text-center space-y-3 p-6 rounded-lg border bg-card">
              <div className="flex justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold">Real-time Guidance</h3>
              <p className="text-sm text-muted-foreground">
                Step-by-step help with analysis results and security decisions
              </p>
            </div>
            
            <div className="text-center space-y-3 p-6 rounded-lg border bg-card">
              <div className="flex justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold">Expert Knowledge</h3>
              <p className="text-sm text-muted-foreground">
                Access to comprehensive fraud detection and cybersecurity expertise
              </p>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="text-center space-y-4">
            {!isChatOpen ? (
              <Button 
                size="lg" 
                className="bg-gradient-hero hover:opacity-90 transition-smooth"
                onClick={() => setChatOpen(true)}
              >
                <Bot className="mr-2 h-5 w-5" />
                Start Conversation
              </Button>
            ) : (
              <p className="text-muted-foreground">Chat window is open. Ask me anything about security!</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
      
      {isChatOpen && <ChatBot onClose={() => setChatOpen(false)} />}
    </div>
  );
};

export default Assistant;