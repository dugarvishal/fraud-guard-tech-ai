import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, Globe, TrendingUp, Activity, Eye, Brain, Cpu, Search, Camera, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Intelligence = () => {
  const [aiMetrics, setAiMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAiMetrics = async () => {
      try {
        const { data, error } = await supabase
          .from('ai_metrics')
          .select('*')
          .order('recorded_at', { ascending: false });

        if (error) throw error;
        setAiMetrics(data || []);
      } catch (error) {
        console.error('Error fetching AI metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAiMetrics();
  }, []);

  const threatMetrics = [
    { name: "Phishing Campaigns", count: 2847, trend: +12, severity: "high" },
    { name: "Malware Variants", count: 1923, trend: -5, severity: "critical" },
    { name: "Scam Domains", count: 5612, trend: +8, severity: "medium" },
    { name: "Fake Apps", count: 892, trend: +23, severity: "high" }
  ];

  const aiTechnologies = [
    {
      name: "Natural Language Processing",
      icon: Brain,
      description: "Advanced transformer models analyze website content using state-of-the-art NLP techniques for threat detection.",
      features: ["BERT-based Classification", "GPT-powered Analysis", "Multilingual Detection", "Semantic Understanding"],
      accuracy: 96.2,
      model: "transformer-based",
      status: "active"
    },
    {
      name: "Computer Vision",
      icon: Camera,
      description: "Enhanced deep learning models with WebGPU acceleration for real-time visual threat analysis.",
      features: ["CNN-based Detection", "Object Recognition", "Brand Impersonation", "Layout Fingerprinting"],
      accuracy: 92.4,
      model: "ResNet-50 + DETR",
      status: "active"
    },
    {
      name: "Real-Time Monitoring",
      icon: Zap,
      description: "Distributed AI system with edge computing for instantaneous threat response and alerting.",
      features: ["Edge AI Processing", "WebSocket Alerts", "Predictive Analysis", "Auto-mitigation"],
      accuracy: 98.1,
      model: "ensemble-based",
      status: "active"
    },
    {
      name: "Behavioral Analysis",
      icon: Search,
      description: "Advanced pattern recognition using reinforcement learning to identify sophisticated attack vectors.",
      features: ["ML-based Patterns", "Anomaly Detection", "Risk Scoring", "Adaptive Learning"],
      accuracy: 94.7,
      model: "reinforcement-learning",
      status: "active"
    }
  ];

  const recentThreats = [
    {
      title: "COVID-19 Vaccine Scam Wave",
      type: "Phishing Campaign",
      severity: "High",
      affected: "12K+ users",
      detected: "2 hours ago"
    },
    {
      title: "Banking Trojan: NewVariant.2024",
      type: "Malware",
      severity: "Critical",
      affected: "8K+ devices",
      detected: "4 hours ago"
    },
    {
      title: "Fake Crypto Exchange Network",
      type: "Fraudulent Platform",
      severity: "High",
      affected: "25K+ users",
      detected: "6 hours ago"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">AI-Powered Intelligence</h1>
            <p className="text-xl text-muted-foreground">
              Advanced artificial intelligence and machine learning driving our threat detection capabilities
            </p>
          </div>

          {/* AI Technologies Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Our AI Technologies</h2>
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-primary">Live AI Systems Active</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {aiTechnologies.map((tech, index) => (
                <Card key={index} className="p-6 relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">{tech.status}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <tech.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{tech.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3">Model: {tech.model}</p>
                      <p className="text-muted-foreground mb-4 text-sm">{tech.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Detection Accuracy</span>
                        <span className="text-sm text-primary font-semibold">{tech.accuracy}%</span>
                      </div>
                      <Progress value={tech.accuracy} className="h-2 mb-4" />
                      <div className="grid grid-cols-2 gap-2">
                        {tech.features.map((feature, idx) => (
                          <div key={idx} className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded flex items-center gap-1">
                            <div className="w-1 h-1 bg-primary rounded-full"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {threatMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold">{metric.count.toLocaleString()}</div>
                    <Badge variant={getSeverityColor(metric.severity)}>
                      {metric.severity}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium mb-1">{metric.name}</div>
                  <div className={`text-xs flex items-center gap-1 ${
                    metric.trend > 0 ? 'text-red-500' : 'text-green-500'
                  }`}>
                    <TrendingUp className="h-3 w-3" />
                    {metric.trend > 0 ? '+' : ''}{metric.trend}% this week
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Global Threat Map */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Global Threat Activity
              </CardTitle>
              <CardDescription>
                Live monitoring of fraud attempts worldwide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-8 text-center">
                <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold mb-2">Interactive Threat Map</p>
                <p className="text-muted-foreground">
                  Real-time visualization of global fraud patterns and attack vectors
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">127</div>
                    <div className="text-sm text-muted-foreground">Active Campaigns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">43</div>
                    <div className="text-sm text-muted-foreground">Countries Affected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">8.2M</div>
                    <div className="text-sm text-muted-foreground">URLs Analyzed</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Threats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Threat Activity
                </CardTitle>
                <CardDescription>
                  Latest detected threats and security incidents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentThreats.map((threat, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{threat.title}</h3>
                        <Badge variant={getSeverityColor(threat.severity)}>
                          {threat.severity}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {threat.type} • {threat.affected}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Activity className="h-3 w-3" />
                        Detected {threat.detected}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Live AI Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Live AI Performance Metrics
                </CardTitle>
                <CardDescription>
                  Real-time performance data from our AI models and detection systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading metrics...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {aiMetrics
                      .filter(metric => metric.metric_type === 'detection_accuracy')
                      .map((metric, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium capitalize">
                              {metric.metric_name.replace('_', ' ')}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {metric.metric_value}%
                            </span>
                          </div>
                          <Progress value={metric.metric_value} className="h-2" />
                          {metric.metadata?.model && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Model: {metric.metadata.model}
                            </div>
                          )}
                        </div>
                      ))}
                    
                    {/* Performance Metrics */}
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-4">Today's Performance</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {aiMetrics
                          .filter(metric => metric.metric_type === 'performance_metric')
                          .map((metric, index) => (
                            <div key={index} className="text-center">
                              <div className="text-lg font-bold text-primary">
                                {metric.metric_value.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground capitalize">
                                {metric.metric_name.replace(/_/g, ' ')}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold mb-4">Stay Protected</h2>
            <p className="text-muted-foreground mb-6">
              Get access to premium threat intelligence and advanced protection features
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 relative">
                Upgrade to Pro 
                <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">upcoming</span>
              </button>
              <button className="border border-border px-6 py-2 rounded-lg font-medium hover:bg-muted">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Intelligence;