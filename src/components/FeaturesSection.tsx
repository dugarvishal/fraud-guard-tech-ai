import { Card, CardContent } from "@/components/ui/card";
import { Brain, Shield, BarChart3, MessageSquare, Globe, Smartphone, BookOpen, Zap } from "lucide-react";
import aiSecurityIcon from "@/assets/ai-security-icon.jpg";
import analyticsDashboard from "@/assets/analytics-dashboard.jpg";

const FeaturesSection = () => {
  const mainFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze patterns, content, and behavior to identify sophisticated fraud attempts in real-time.",
      image: aiSecurityIcon,
      gradient: "from-security-primary to-security-secondary"
    },
    {
      icon: BarChart3,
      title: "Comprehensive Analytics",
      description: "Detailed reports and visualizations help you understand threat landscapes and make informed security decisions.",
      image: analyticsDashboard,
      gradient: "from-security-secondary to-security-ai"
    },
    {
      icon: MessageSquare,
      title: "AI Security Assistant",
      description: "Get instant answers about online threats, security best practices, and personalized fraud prevention advice.",
      gradient: "from-security-ai to-security-trust"
    },
    {
      icon: BookOpen,
      title: "Educational Resources",
      description: "Stay ahead of evolving threats with our comprehensive library of security guides, threat intelligence, and training materials.",
      gradient: "from-security-trust to-security-primary"
    }
  ];

  const capabilities = [
    {
      icon: Globe,
      title: "Website Verification",
      description: "Scan URLs for phishing, malware, and fraudulent content"
    },
    {
      icon: Smartphone,
      title: "Mobile App Analysis",
      description: "Detect malicious apps and suspicious permissions"
    },
    {
      icon: Shield,
      title: "Brand Protection",
      description: "Monitor for brand impersonation and trademark abuse"
    },
    {
      icon: Zap,
      title: "Real-time Alerts",
      description: "Instant notifications for emerging threats and risks"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-feature">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-security-primary/10 text-security-primary border border-security-primary/20">
            <Shield className="w-4 h-4 mr-2" />
            Platform Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Complete Fraud Detection Suite
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Leverage cutting-edge AI technology to protect your digital presence with comprehensive fraud detection and prevention tools.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <Card key={index} className="group hover:shadow-feature transition-all duration-300 border-0 bg-gradient-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {feature.image && (
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20`}></div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.gradient}`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Capabilities Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">Detection Capabilities</h3>
            <p className="text-muted-foreground">Comprehensive protection across all digital touchpoints</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((capability, index) => (
              <Card key={index} className="text-center hover:shadow-card transition-all duration-300 bg-card/50 backdrop-blur-sm border-security-primary/10">
                <CardContent className="p-6 space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center">
                    <capability.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground">{capability.title}</h4>
                  <p className="text-sm text-muted-foreground">{capability.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;