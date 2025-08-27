import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-security-primary/5 via-background to-security-secondary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA */}
        <Card className="relative overflow-hidden bg-gradient-hero shadow-hero border-0 mb-12">
          <CardContent className="p-8 lg:p-12 text-center text-white">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Ready to Secure Your Digital Presence?
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                Join thousands of users who trust FraudGuard AI to protect their online activities. Start with a free analysis today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" variant="secondary" className="bg-white text-security-primary hover:bg-white/90 font-semibold" asChild>
                  <Link to="/submit">
                    Start Free Analysis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Schedule Demo
                </Button>
              </div>
            </div>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full -translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-48 translate-y-48"></div>
            </div>
          </CardContent>
        </Card>

      </div>
    </section>
  );
};

export default CTASection;