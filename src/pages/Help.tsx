import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, Search, MessageCircle, Mail, Book } from "lucide-react";

const Help = () => {
  const faqs = [
    {
      question: "How accurate is the fraud detection?",
      answer: "Our AI-powered system achieves 99.7% accuracy in fraud detection by combining multiple analysis techniques including domain reputation, content analysis, visual similarity detection, and behavioral pattern matching."
    },
    {
      question: "How long does an analysis take?",
      answer: "Most URL analyses complete within 2-3 seconds. Complex analyses involving screenshot capture and deep content analysis may take up to 10 seconds."
    },
    {
      question: "What types of threats can you detect?",
      answer: "We detect phishing domains, malware-laden sites, fake websites, scam mobile apps, app/website clones, suspicious language patterns, and UI similarity attacks."
    },
    {
      question: "Is my data secure when using your service?",
      answer: "Yes, we use enterprise-grade security measures. URLs are analyzed in isolated environments, and no personal data is stored beyond the analysis period."
    },
    {
      question: "Can I integrate this with my business systems?",
      answer: "Yes, we offer a comprehensive REST API for businesses wanting to integrate our fraud detection capabilities into their existing systems."
    },
    {
      question: "What does the risk score mean?",
      answer: "Risk scores range from 0-100: 0-30 is Low Risk (legitimate), 31-70 is Medium Risk (suspicious, proceed with caution), and 71-100 is High Risk (likely fraudulent)."
    },
    {
      question: "Do you offer batch processing?",
      answer: "Yes, registered users can upload CSV files containing multiple URLs for bulk analysis. This is perfect for security teams and businesses."
    },
    {
      question: "How often is your threat intelligence updated?",
      answer: "Our threat intelligence database is updated in real-time with new threats detected globally. Our AI models are retrained weekly with the latest fraud patterns."
    }
  ];

  const supportChannels = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      action: "Start Chat",
      available: "24/7"
    },
    {
      title: "Email Support",
      description: "Send us detailed questions and we'll respond within 24 hours",
      icon: Mail,
      action: "Send Email",
      available: "support@fraudguard.ai"
    },
    {
      title: "Documentation",
      description: "Comprehensive guides and API documentation",
      icon: Book,
      action: "Browse Docs",
      available: "Always Updated"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions and get the support you need
            </p>
          </div>

          {/* Search */}
          <Card className="mb-12">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search for help articles..." 
                    className="pl-10"
                  />
                </div>
                <Button>Search</Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Help */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {supportChannels.map((channel, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <channel.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{channel.title}</CardTitle>
                  <CardDescription>{channel.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{channel.available}</p>
                  <Button variant="outline" className="w-full">
                    {channel.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find quick answers to the most common questions about our service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is ready to assist you with any questions or issues
            </p>
            <div className="flex justify-center gap-4">
              <Button>Contact Support</Button>
              <Button variant="outline">Schedule a Demo</Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Help;