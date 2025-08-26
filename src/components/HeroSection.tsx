import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-fraud-detection.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-security-primary/10 text-security-primary border border-security-primary/20">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered Protection
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Detect Fraud
                <span className="bg-gradient-hero bg-clip-text text-transparent"> Instantly</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Advanced AI analyzes websites, mobile apps, and digital content to identify fraudulent activities before they can harm you or your business.
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-security-primary">99.7%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-security-primary">50M+</div>
                <div className="text-sm text-muted-foreground">URLs Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-security-primary">2.3s</div>
                <div className="text-sm text-muted-foreground">Avg Analysis</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-hero hover:opacity-90 transition-smooth shadow-hero" asChild>
                <Link to="/submit">
                  Start Free Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-security-ai" />
                <span>Enterprise-Grade Security</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Real-time Analysis</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-hero">
              <img
                src={heroImage}
                alt="AI-powered fraud detection dashboard"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-security-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-card rounded-lg shadow-card p-4 border animate-pulse">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">Threat Detected</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-card rounded-lg shadow-card p-4 border">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Site Verified Safe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;