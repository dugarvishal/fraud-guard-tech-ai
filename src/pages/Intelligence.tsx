import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, Globe, TrendingUp, Activity, Eye } from "lucide-react";

const Intelligence = () => {
  const threatMetrics = [
    { name: "Phishing Campaigns", count: 2847, trend: +12, severity: "high" },
    { name: "Malware Variants", count: 1923, trend: -5, severity: "critical" },
    { name: "Scam Domains", count: 5612, trend: +8, severity: "medium" },
    { name: "Fake Apps", count: 892, trend: +23, severity: "high" }
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
            <h1 className="text-4xl font-bold mb-4">Threat Intelligence</h1>
            <p className="text-xl text-muted-foreground">
              Real-time insights into the global fraud and security landscape
            </p>
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

            {/* AI Detection Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  AI Detection Performance
                </CardTitle>
                <CardDescription>
                  Real-time performance metrics of our detection systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Phishing Detection</span>
                      <span className="text-sm text-muted-foreground">94.7%</span>
                    </div>
                    <Progress value={94.7} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Malware Classification</span>
                      <span className="text-sm text-muted-foreground">91.2%</span>
                    </div>
                    <Progress value={91.2} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Brand Impersonation</span>
                      <span className="text-sm text-muted-foreground">88.9%</span>
                    </div>
                    <Progress value={88.9} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">App Store Fraud</span>
                      <span className="text-sm text-muted-foreground">92.4%</span>
                    </div>
                    <Progress value={92.4} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold mb-4">Stay Protected</h2>
            <p className="text-muted-foreground mb-6">
              Get access to premium threat intelligence and advanced protection features
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90">
                Upgrade to Pro
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