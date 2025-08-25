import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Shield, BarChart3, History, Bell, FileText, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginBenefitsBannerProps {
  onDismiss?: () => void;
  trigger?: 'analysis-complete' | 'multiple-submissions' | 'default';
}

const LoginBenefitsBanner: React.FC<LoginBenefitsBannerProps> = ({ 
  onDismiss, 
  trigger = 'default' 
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const { user } = useAuth();

  if (user || isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const benefits = [
    {
      icon: BarChart3,
      title: 'Personalized Analytics',
      description: 'Track your security analysis history and trends'
    },
    {
      icon: History,
      title: 'Submission History',
      description: 'Access all your past scans with detailed reports'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get alerts about new threats and security updates'
    },
    {
      icon: FileText,
      title: 'Detailed Reports',
      description: 'Export comprehensive security analysis reports'
    },
    {
      icon: Zap,
      title: 'Batch Processing',
      description: 'Analyze multiple URLs and apps simultaneously'
    },
    {
      icon: Shield,
      title: 'Priority Support',
      description: 'Get faster analysis and dedicated support'
    }
  ];

  const triggerMessages = {
    'analysis-complete': 'Great analysis! Want to save your results?',
    'multiple-submissions': 'Making multiple checks? Save time with an account!',
    'default': 'Unlock powerful security features'
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">{triggerMessages[trigger]}</h3>
              <Badge variant="secondary" className="text-xs">Free Account</Badge>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Create a free account to unlock enhanced security features and keep track of your analysis history.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <benefit.icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <span className="font-medium">{benefit.title}</span>
                    <p className="text-muted-foreground text-xs">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button asChild>
                <Link to="/auth">Get Started Free</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                No spam, cancel anytime
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginBenefitsBanner;