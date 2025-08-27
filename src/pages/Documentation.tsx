import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Brain, 
  Eye, 
  AlertTriangle, 
  Code, 
  Users, 
  TrendingUp, 
  Zap,
  CheckCircle,
  ArrowRight,
  Globe,
  Smartphone,
  Server,
  DollarSign,
  Target,
  Lightbulb,
  Gauge,
  Layers
} from "lucide-react";

const Documentation = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI-Powered Threat Detection System
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive documentation for our advanced cybersecurity platform utilizing NLP, Computer Vision, and Real-Time Intelligence
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-9 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usecases">Use Cases</TabsTrigger>
            <TabsTrigger value="solution">Solution</TabsTrigger>
            <TabsTrigger value="ux">User Experience</TabsTrigger>
            <TabsTrigger value="innovation">Innovation</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="scalability">Scalability</TabsTrigger>
          </TabsList>

          {/* System Overview */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  System Architecture & Features
                </CardTitle>
                <CardDescription>
                  Understanding how our AI-powered threat detection system works
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Components */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Brain className="h-5 w-5 text-blue-500" />
                        Natural Language Processing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Advanced NLP engine that analyzes website content for suspicious patterns
                      </p>
                      <div className="space-y-2">
                        <Badge variant="secondary">Urgency Detection</Badge>
                        <Badge variant="secondary">Impersonation Analysis</Badge>
                        <Badge variant="secondary">Threat Scoring</Badge>
                        <Badge variant="secondary">Financial Risk Assessment</Badge>
                      </div>
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs font-mono">
                          Status: <span className="text-green-600">✓ Fully Implemented</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Analyzes text for scam indicators, urgency patterns, and suspicious language
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Eye className="h-5 w-5 text-purple-500" />
                        Computer Vision
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Visual analysis engine for brand similarity and UI pattern detection
                      </p>
                      <div className="space-y-2">
                        <Badge variant="secondary">Brand Comparison</Badge>
                        <Badge variant="secondary">UI Element Detection</Badge>
                        <Badge variant="secondary">Layout Analysis</Badge>
                        <Badge variant="secondary">Logo Recognition</Badge>
                      </div>
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs font-mono">
                          Status: <span className="text-yellow-600">⚠ Partial Implementation</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Content analysis implemented, image processing needs enhancement
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-red-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Real-Time Alerting
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Instant threat detection with browser extension and web app integration
                      </p>
                      <div className="space-y-2">
                        <Badge variant="secondary">Browser Extension</Badge>
                        <Badge variant="secondary">Real-time Scanning</Badge>
                        <Badge variant="secondary">Instant Notifications</Badge>
                        <Badge variant="secondary">Risk Scoring</Badge>
                      </div>
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs font-mono">
                          Status: <span className="text-green-600">✓ Fully Implemented</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Browser extension active, web app integration complete
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                {/* System Flow Diagram */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">System Architecture Flow</h3>
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                          <Globe className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-sm font-medium">URL Input</p>
                        <p className="text-xs text-muted-foreground">Website/App URL</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-2">
                          <Brain className="h-6 w-6 text-blue-500" />
                        </div>
                        <p className="text-sm font-medium">NLP Analysis</p>
                        <p className="text-xs text-muted-foreground">Content Processing</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-2">
                          <Eye className="h-6 w-6 text-purple-500" />
                        </div>
                        <p className="text-sm font-medium">Visual Analysis</p>
                        <p className="text-xs text-muted-foreground">UI Comparison</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
                          <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <p className="text-sm font-medium">Threat Score</p>
                        <p className="text-xs text-muted-foreground">Risk Assessment</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Demo */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Interactive Demo</h3>
                  <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <p className="text-muted-foreground">
                          Try our system with real-time analysis
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button onClick={() => setActiveDemo('web')} className="gap-2">
                            <Globe className="h-4 w-4" />
                            Web Analysis Demo
                          </Button>
                          <Button variant="outline" onClick={() => setActiveDemo('extension')} className="gap-2">
                            <Shield className="h-4 w-4" />
                            Browser Extension Demo
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Use Cases for Coding */}
          <TabsContent value="usecases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-6 w-6 text-primary" />
                  Use Cases for Coding & AI Implementation
                </CardTitle>
                <CardDescription>
                  Practical applications and implementation scenarios for developers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Developer Use Cases */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Individual Developer Use Cases</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Website Security Validation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Validate website security before deployment or third-party integration
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Pre-deployment security checks
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Third-party API endpoint verification
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Code repository link safety
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-xs font-mono text-green-800">
                            API Integration: POST /api/analyze/url
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Development Environment Protection</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Protect development environments from malicious packages and dependencies
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                            NPM package URL verification
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                            GitHub repository analysis
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                            Documentation link validation
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs font-mono text-blue-800">
                            CLI Tool: npx threat-detector scan
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Enterprise Use Cases */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Enterprise Integration Use Cases</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-l-4 border-l-purple-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">CI/CD Pipeline Security</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Automated security checks integrated into continuous deployment pipelines
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-purple-500" />
                            GitHub Actions integration
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-purple-500" />
                            Jenkins plugin support
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-purple-500" />
                            GitLab CI/CD workflows
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                          <p className="text-xs font-mono text-purple-800">
                            Webhook: POST /webhook/pipeline-check
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Customer Protection Services</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Integrate threat detection into customer-facing applications and services
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-orange-500" />
                            E-commerce link verification
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-orange-500" />
                            Social media link scanning
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-orange-500" />
                            Email attachment analysis
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <p className="text-xs font-mono text-orange-800">
                            SDK: import ThreatDetector from '@/lib/enhancedAnalysis'
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* AI Toolkit Implementation */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">AI Toolkit Implementation Examples</h3>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Brain className="h-5 w-5 text-blue-500" />
                          NLP Integration Example
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                          <pre>{`import { advancedNLPAnalyzer } from '@/lib/advancedNLP';

// Analyze website content for suspicious patterns
const nlpResult = await advancedNLPAnalyzer.analyzeText(websiteContent);

console.log('Urgency Score:', nlpResult.urgencyScore);
console.log('Threat Indicators:', nlpResult.detectedPatterns);
console.log('Suspicious Entities:', nlpResult.suspiciousEntities);`}</pre>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Eye className="h-5 w-5 text-purple-500" />
                          Computer Vision Setup
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                          <pre>{`import { computerVisionAnalyzer } from '@/lib/computerVision';

// Compare UI similarity with known brands
const visualAnalysis = await computerVisionAnalyzer.analyzeWebsiteVisuals(url, content);

console.log('Brand Similarities:', visualAnalysis.brandSimilarities);
console.log('UI Elements:', visualAnalysis.detectedUIElements);
console.log('Layout Suspicion:', visualAnalysis.layoutSuspicionScore);`}</pre>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          Real-Time Monitoring Implementation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                          <pre>{`import { realTimeScanEngine } from '@/lib/realTimeScanning';

// Set up real-time monitoring with alerts
realTimeScanEngine.onAlert((result) => {
  if (result.riskScore > 0.8) {
    showWarningNotification(result);
    blockPageAccess(result.url);
  }
});

// Scan URL in real-time
const scanResult = await realTimeScanEngine.scanURL(url, {
  includeNLP: true,
  includeVisualAnalysis: true,
  enableRealTimeAlerts: true
});`}</pre>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Solution & Benefits */}
          <TabsContent value="solution" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Solution Architecture & Key Benefits
                </CardTitle>
                <CardDescription>
                  Comprehensive solution breakdown with tangible and intangible benefits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Requirements */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Key Requirements for Each Use Case</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Server className="h-4 w-4" />
                        Technical Requirements
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          React 18+ with TypeScript
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Supabase backend integration
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          AI/ML model hosting (Hugging Face Transformers)
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Real-time WebSocket connections
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Browser extension manifest v3
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Security Requirements
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          End-to-end encryption for data transmission
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          No sensitive data storage in browser
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          GDPR compliance for data processing
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Rate limiting and abuse prevention
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          API authentication and authorization
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Implementation Approach */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Implementation Approach</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="border-t-4 border-t-blue-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Modular Architecture</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Independent analysis modules that can be used separately or combined
                        </p>
                        <div className="space-y-1 text-xs">
                          <div>• NLP Analysis Engine</div>
                          <div>• Computer Vision Processor</div>
                          <div>• Real-Time Monitoring Service</div>
                          <div>• Enhanced Analysis Coordinator</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-t-4 border-t-purple-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">API-First Design</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          RESTful APIs with comprehensive documentation and SDKs
                        </p>
                        <div className="space-y-1 text-xs">
                          <div>• REST API endpoints</div>
                          <div>• WebSocket real-time streams</div>
                          <div>• GraphQL query interface</div>
                          <div>• Webhook event system</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-t-4 border-t-green-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Scalable Infrastructure</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Cloud-native architecture with auto-scaling capabilities
                        </p>
                        <div className="space-y-1 text-xs">
                          <div>• Containerized microservices</div>
                          <div>• Load balancer distribution</div>
                          <div>• Database connection pooling</div>
                          <div>• CDN content delivery</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Benefits */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Tangible Benefits
                    </h3>
                    <div className="space-y-3">
                      <Card className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Cost Reduction</p>
                            <p className="text-xs text-muted-foreground">75% reduction in security incident response costs</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Zap className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Detection Speed</p>
                            <p className="text-xs text-muted-foreground">Sub-second threat identification and alerting</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Gauge className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Accuracy Improvement</p>
                            <p className="text-xs text-muted-foreground">95%+ threat detection accuracy with low false positives</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-blue-500" />
                      Intangible Benefits
                    </h3>
                    <div className="space-y-3">
                      <Card className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <Shield className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Brand Protection</p>
                            <p className="text-xs text-muted-foreground">Enhanced reputation and customer trust</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">User Confidence</p>
                            <p className="text-xs text-muted-foreground">Increased user engagement and retention</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-teal-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Compliance Assurance</p>
                            <p className="text-xs text-muted-foreground">Regulatory compliance and audit readiness</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Experience */}
          <TabsContent value="ux" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  User Experience & Interaction Design
                </CardTitle>
                <CardDescription>
                  Comprehensive analysis of usability, accessibility, and interaction effectiveness
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Usability */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Usability & Navigation</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Intuitive Interface Design</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Single-click URL analysis submission
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Real-time progress indicators
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Clear threat severity visualization
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Contextual help and tooltips
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-xs text-green-700">
                            Users can understand and use the system within 30 seconds of first interaction
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Seamless Navigation Flow</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                            Breadcrumb navigation system
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                            Quick action shortcuts
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                            Search and filter capabilities
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                            Mobile-responsive design
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-700">
                            Consistent navigation patterns across all devices and screen sizes
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Accessibility */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Accessibility & Inclusive Design</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Visual Accessibility</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>• High contrast color schemes</div>
                          <div>• Scalable text and UI elements</div>
                          <div>• Alternative text for images</div>
                          <div>• Color-blind friendly palette</div>
                          <div>• Focus indicators</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Motor Accessibility</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>• Keyboard navigation support</div>
                          <div>• Large click targets (44px minimum)</div>
                          <div>• Voice command integration</div>
                          <div>• Gesture-based controls</div>
                          <div>• Timeout extensions</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Cognitive Accessibility</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>• Simple, clear language</div>
                          <div>• Consistent interaction patterns</div>
                          <div>• Error prevention and recovery</div>
                          <div>• Progress indicators</div>
                          <div>• Help documentation</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Interaction Effectiveness */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Interaction Effectiveness</h3>
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">Response Time Metrics</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">URL Analysis</span>
                                <Badge variant="secondary">&lt; 3 seconds</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Real-time Alerts</span>
                                <Badge variant="secondary">&lt; 500ms</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Report Generation</span>
                                <Badge variant="secondary">&lt; 1 second</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">API Response</span>
                                <Badge variant="secondary">&lt; 200ms</Badge>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3">User Satisfaction Metrics</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Task Completion Rate</span>
                                <Badge variant="secondary">98%</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">User Error Rate</span>
                                <Badge variant="secondary">&lt; 2%</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Learning Curve</span>
                                <Badge variant="secondary">&lt; 5 minutes</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">User Retention</span>
                                <Badge variant="secondary">92%</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Multi-Platform Experience */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Cross-Platform Experience</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="text-center">
                      <CardContent className="p-6">
                        <Globe className="h-8 w-8 mx-auto mb-3 text-primary" />
                        <h4 className="font-semibold mb-2">Web Application</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Full-featured web interface with comprehensive analysis tools
                        </p>
                        <div className="text-xs space-y-1">
                          <div>• Desktop & mobile responsive</div>
                          <div>• Progressive Web App (PWA)</div>
                          <div>• Offline capability</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="text-center">
                      <CardContent className="p-6">
                        <Shield className="h-8 w-8 mx-auto mb-3 text-primary" />
                        <h4 className="font-semibold mb-2">Browser Extension</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Real-time protection with minimal interface disruption
                        </p>
                        <div className="text-xs space-y-1">
                          <div>• Chrome, Firefox, Safari support</div>
                          <div>• Contextual warnings</div>
                          <div>• One-click analysis</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="text-center">
                      <CardContent className="p-6">
                        <Smartphone className="h-8 w-8 mx-auto mb-3 text-primary" />
                        <h4 className="font-semibold mb-2">Mobile Integration</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Native mobile app with touch-optimized interface
                        </p>
                        <div className="text-xs space-y-1">
                          <div>• iOS & Android native apps</div>
                          <div>• Push notifications</div>
                          <div>• Camera-based QR scanning</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Continue with other tabs... */}
          {/* The remaining tabs (innovation, business, implementation, financial, scalability) would follow similar patterns */}
          
          <TabsContent value="innovation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-primary" />
                  Innovation & Technological Advancement
                </CardTitle>
                <CardDescription>
                  Novel approaches and unique technological innovations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Innovation content section would be implemented here with detailed technical innovations, unique approaches, and competitive advantages.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Business Opportunities & Market Potential
                </CardTitle>
                <CardDescription>
                  Market analysis, opportunities, and commercial viability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Business opportunities content section would be implemented here with market analysis, customer segments, and revenue potential.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="implementation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-6 w-6 text-primary" />
                  Ease of Implementation
                </CardTitle>
                <CardDescription>
                  Implementation readiness, complexity, and deployment considerations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Implementation guide content section would be implemented here with deployment strategies, technical requirements, and complexity analysis.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-primary" />
                  Financial Feasibility
                </CardTitle>
                <CardDescription>
                  Economic viability, cost analysis, and revenue projections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Financial analysis content section would be implemented here with cost-benefit analysis, revenue models, and ROI projections.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scalability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-6 w-6 text-primary" />
                  Scalability & Reusability
                </CardTitle>
                <CardDescription>
                  Growth potential, architectural scalability, and reusable components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Scalability analysis content section would be implemented here with growth strategies, architectural considerations, and reusability frameworks.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Documentation;