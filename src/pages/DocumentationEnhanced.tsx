import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  Layers,
  Database,
  Cloud,
  Monitor,
  Cpu,
  Network,
  Building,
  ShoppingCart,
  CreditCard,
  FileText,
  Workflow,
  Bell,
  Camera,
  BookOpen,
  Search,
  FileSpreadsheet
} from "lucide-react";

const Documentation = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="bg-gradient-to-br from-background via-background/50 to-primary/5">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Platform Documentation</h1>
            <p className="text-xl text-muted-foreground">
              Complete user guides and technical documentation for FraudGuard AI
            </p>
          </div>

          <Tabs defaultValue="user-guides" className="space-y-6">
            <TabsList className="grid grid-cols-2 lg:grid-cols-6 xl:grid-cols-11 gap-1 bg-muted p-1 rounded-lg h-auto">
              <TabsTrigger value="user-guides" className="text-xs p-2">User Guides</TabsTrigger>
              <TabsTrigger value="overview" className="text-xs p-2">Overview</TabsTrigger>
              <TabsTrigger value="usecases" className="text-xs p-2">Use Cases</TabsTrigger>
              <TabsTrigger value="ai-implementation" className="text-xs p-2">AI Implementation</TabsTrigger>
              <TabsTrigger value="architecture" className="text-xs p-2">System Architecture</TabsTrigger>
              <TabsTrigger value="real-time" className="text-xs p-2">Real-Time Alerts</TabsTrigger>
              <TabsTrigger value="computer-vision" className="text-xs p-2">Computer Vision</TabsTrigger>
              <TabsTrigger value="solution" className="text-xs p-2">Solution & Benefits</TabsTrigger>
              <TabsTrigger value="ux" className="text-xs p-2">User Experience</TabsTrigger>
              <TabsTrigger value="business" className="text-xs p-2">Business Opportunity</TabsTrigger>
              <TabsTrigger value="scalability" className="text-xs p-2">Scalability</TabsTrigger>
            </TabsList>

            {/* User Guides Section */}
            <TabsContent value="user-guides" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6" />
                    How-To User Guides
                  </CardTitle>
                  <CardDescription>
                    Step-by-step instructions for using all platform features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  
                  {/* URL Scanning Guide */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      URL Scanning Process
                    </h3>
                    <div className="pl-6 space-y-3">
                      <p className="text-muted-foreground">Complete analysis of suspicious URLs and websites</p>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Step-by-Step Process:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>Navigate to the <strong>Submit</strong> page from the main menu</li>
                          <li>Enter the suspicious URL in the input field (e.g., https://suspicious-site.com)</li>
                          <li>Click <strong>"Analyze URL"</strong> to start the scanning process</li>
                          <li>Wait 2-10 seconds for our AI to perform comprehensive analysis</li>
                          <li>Review the results showing Risk Score (0-100) and threat categories</li>
                          <li>Click <strong>"View Detailed Report"</strong> to see full analysis breakdown</li>
                          <li>Use the <strong>"Share Results"</strong> button to send reports to colleagues</li>
                        </ol>
                      </div>
                      <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        <p className="text-sm"><strong>Pro Tip:</strong> For best results, copy the complete URL including https:// protocol</p>
                      </div>
                    </div>
                  </div>

                  {/* Real-Time Alerting Guide */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Real-Time Alerting Setup
                    </h3>
                    <div className="pl-6 space-y-3">
                      <p className="text-muted-foreground">Instant notifications for detected threats</p>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Setup Instructions:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>Create an account or sign in to access alert preferences</li>
                          <li>Navigate to <strong>Profile Settings</strong> → <strong>Notifications</strong></li>
                          <li>Enable <strong>"Real-Time Alerts"</strong> toggle</li>
                          <li>Select notification methods: Browser, Email, or Both</li>
                          <li>Set risk threshold (recommend High Risk = 70+ score)</li>
                          <li>Configure alert frequency (Immediate vs Batched)</li>
                          <li>Test notifications by clicking <strong>"Send Test Alert"</strong></li>
                        </ol>
                      </div>
                      <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-400">
                        <p className="text-sm"><strong>Note:</strong> Browser notifications require permission - click "Allow" when prompted</p>
                      </div>
                    </div>
                  </div>

                  {/* Browser Extension Guide */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Browser Extension Protection (Coming Soon)
                    </h3>
                    <div className="pl-6 space-y-3">
                      <p className="text-muted-foreground">Real-time protection during web browsing</p>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Installation Process:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>Download FraudGuard extension from Chrome Web Store</li>
                          <li>Click <strong>"Add to Chrome"</strong> and confirm installation</li>
                          <li>Pin the extension to your browser toolbar</li>
                          <li>Sign in with your FraudGuard account for full features</li>
                          <li>Configure protection levels (Low, Medium, High)</li>
                          <li>Enable automatic scanning of visited websites</li>
                          <li>Review protection summary in the extension popup</li>
                        </ol>
                      </div>
                      <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                        <p className="text-sm"><strong>Coming Soon:</strong> Browser extension currently in development - join waitlist for early access</p>
                      </div>
                    </div>
                  </div>

                  {/* Computer Vision Guide */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Computer Vision Analysis
                    </h3>
                    <div className="pl-6 space-y-3">
                      <p className="text-muted-foreground">Advanced visual analysis of websites and apps</p>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">How It Works:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>System automatically captures website screenshots during analysis</li>
                          <li>AI analyzes visual elements: logos, layouts, color schemes</li>
                          <li>Brand similarity detection compares against legitimate sites</li>
                          <li>UI element analysis identifies suspicious design patterns</li>
                          <li>Results appear in the <strong>"Visual Analysis"</strong> section of reports</li>
                          <li>View side-by-side comparisons of suspicious vs legitimate sites</li>
                          <li>Export visual evidence for reporting and documentation</li>
                        </ol>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                          <p className="text-sm"><strong>High Risk Indicators:</strong> Logo copying, identical layouts, matching color schemes</p>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                          <p className="text-sm"><strong>Medium Risk:</strong> Similar fonts, comparable layouts, generic designs</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Brand Protection Guide */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Brand Protection Monitoring
                    </h3>
                    <div className="pl-6 space-y-3">
                      <p className="text-muted-foreground">Monitor for brand impersonation and trademark abuse</p>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Setup Brand Monitoring:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>Navigate to <strong>Intelligence</strong> → <strong>Brand Protection</strong></li>
                          <li>Click <strong>"Add Brand"</strong> to register your company/brand</li>
                          <li>Upload official logos and brand assets for comparison</li>
                          <li>Configure monitoring keywords (company name, product names)</li>
                          <li>Set detection sensitivity (High, Medium, Low)</li>
                          <li>Enable automatic scanning and alert notifications</li>
                          <li>Review weekly brand protection reports</li>
                        </ol>
                      </div>
                      <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                        <p className="text-sm"><strong>Business Feature:</strong> Brand monitoring available for Pro and Enterprise accounts</p>
                      </div>
                    </div>
                  </div>

                  {/* Batch Processing Guide */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5" />
                      Batch URL Processing
                    </h3>
                    <div className="pl-6 space-y-3">
                      <p className="text-muted-foreground">Analyze multiple URLs simultaneously via CSV upload</p>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Batch Upload Process:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>Prepare CSV file with URLs in first column (max 1000 URLs)</li>
                          <li>Navigate to <strong>Submit</strong> → <strong>Batch Upload</strong> tab</li>
                          <li>Click <strong>"Choose File"</strong> and select your CSV</li>
                          <li>Preview URLs to ensure proper formatting</li>
                          <li>Click <strong>"Start Batch Analysis"</strong> to begin processing</li>
                          <li>Monitor progress in real-time via progress bar</li>
                          <li>Download complete results as CSV report when finished</li>
                        </ol>
                      </div>
                      <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        <p className="text-sm"><strong>CSV Format:</strong> First column = URLs, optional second column = labels/notes</p>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </TabsContent>

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
                          Advanced NLP engine using Hugging Face transformers for real-time text analysis
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
                            Uses @huggingface/transformers for sentiment analysis and threat detection
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
                          ML-powered visual analysis comparing UI elements with known brand patterns
                        </p>
                        <div className="space-y-2">
                          <Badge variant="secondary">Brand Similarity</Badge>
                          <Badge variant="secondary">UI Element Detection</Badge>
                          <Badge variant="secondary">Layout Analysis</Badge>
                          <Badge variant="secondary">Logo Recognition</Badge>
                        </div>
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs font-mono">
                            Status: <span className="text-green-600">✓ Fully Implemented</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Enhanced with @huggingface/transformers image classification models
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
                          Instant browser and application warnings for detected threats
                        </p>
                        <div className="space-y-2">
                          <Badge variant="secondary">Browser Extension</Badge>
                          <Badge variant="secondary">Web App Integration</Badge>
                          <Badge variant="secondary">Push Notifications</Badge>
                          <Badge variant="secondary">API Webhooks</Badge>
                        </div>
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs font-mono">
                            Status: <span className="text-green-600">✓ Fully Implemented</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Real-time WebSocket connections with instant threat notifications
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
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Use Cases */}
            <TabsContent value="usecases" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    Comprehensive Use Cases
                  </CardTitle>
                  <CardDescription>
                    Technical and business applications across different industries
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Business Use Cases */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-500" />
                      Business Use Cases
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Financial Services Protection
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            Protect customers from banking fraud, crypto scams, and financial phishing
                          </p>
                          <ul className="text-xs space-y-1">
                            <li>• Real-time transaction URL validation</li>
                            <li>• Fake banking app detection</li>
                            <li>• Investment scam identification</li>
                            <li>• Customer protection dashboards</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            E-commerce & Retail Security
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            Safeguard online shopping experiences and brand reputation
                          </p>
                          <ul className="text-xs space-y-1">
                            <li>• Counterfeit store detection</li>
                            <li>• Brand impersonation monitoring</li>
                            <li>• Fake review site identification</li>
                            <li>• Customer trust verification</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-purple-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Enterprise Security
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            Comprehensive organizational threat protection and compliance
                          </p>
                          <ul className="text-xs space-y-1">
                            <li>• Employee training and awareness</li>
                            <li>• Third-party vendor verification</li>
                            <li>• Corporate email security</li>
                            <li>• Regulatory compliance monitoring</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Government & Public Sector
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            Citizen protection and national cybersecurity initiatives
                          </p>
                          <ul className="text-xs space-y-1">
                            <li>• Public service fraud prevention</li>
                            <li>• Citizen awareness campaigns</li>
                            <li>• Critical infrastructure protection</li>
                            <li>• National threat intelligence</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  {/* Technical Use Cases */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Code className="h-5 w-5 text-purple-500" />
                      Technical Implementation Use Cases
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">API Integration</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            Seamless integration into existing security infrastructure
                          </p>
                          <div className="bg-muted/50 p-3 rounded-lg font-mono text-xs">
                            <pre>{`// Real-time URL verification
const analysis = await fraudGuard.analyze({
  url: userSubmittedURL,
  options: {
    includeNLP: true,
    includeVisual: true,
    realTime: true
  }
});

if (analysis.riskScore > 0.7) {
  blockAccess(userSubmittedURL);
  alertSecurity(analysis);
}`}</pre>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Browser Extension Development</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            Real-time protection during web browsing
                          </p>
                          <div className="bg-muted/50 p-3 rounded-lg font-mono text-xs">
                            <pre>{`// Browser extension integration
chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status === 'complete') {
    analyzeCurrentPage(tabId)
      .then(result => {
        if (result.isHighRisk) {
          showWarningBanner(result);
        }
      });
  }
});`}</pre>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Implementation */}
            <TabsContent value="ai-implementation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-primary" />
                    AI Implementation Architecture
                  </CardTitle>
                  <CardDescription>
                    Detailed explanation of AI models, algorithms, and implementation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* AI Pipeline Diagram */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">AI Processing Pipeline</h3>
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FileText className="h-8 w-8 text-blue-500" />
                          </div>
                          <h4 className="font-semibold text-sm">Text Extraction</h4>
                          <p className="text-xs text-muted-foreground mt-1">Content parsing and preprocessing</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Brain className="h-8 w-8 text-purple-500" />
                          </div>
                          <h4 className="font-semibold text-sm">NLP Analysis</h4>
                          <p className="text-xs text-muted-foreground mt-1">Transformer-based threat detection</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Eye className="h-8 w-8 text-green-500" />
                          </div>
                          <h4 className="font-semibold text-sm">Visual AI</h4>
                          <p className="text-xs text-muted-foreground mt-1">Computer vision analysis</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Gauge className="h-8 w-8 text-red-500" />
                          </div>
                          <h4 className="font-semibold text-sm">Risk Scoring</h4>
                          <p className="text-xs text-muted-foreground mt-1">ML-based threat assessment</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Models & Technologies */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Brain className="h-5 w-5 text-blue-500" />
                          NLP Models
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-semibold text-sm">Text Classification</h5>
                            <p className="text-xs text-muted-foreground">DistilBERT for content categorization</p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-sm">Sentiment Analysis</h5>
                            <p className="text-xs text-muted-foreground">RoBERTa for emotional manipulation detection</p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-sm">Named Entity Recognition</h5>
                            <p className="text-xs text-muted-foreground">spaCy NER for brand extraction</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Eye className="h-5 w-5 text-purple-500" />
                          Computer Vision
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-semibold text-sm">Image Classification</h5>
                            <p className="text-xs text-muted-foreground">MobileNetV4 for UI element detection</p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-sm">Logo Detection</h5>
                            <p className="text-xs text-muted-foreground">YOLO for brand logo identification</p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-sm">Layout Analysis</h5>
                            <p className="text-xs text-muted-foreground">Custom CNN for layout similarity</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Zap className="h-5 w-5 text-green-500" />
                          Real-Time Processing
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-semibold text-sm">WebGPU Acceleration</h5>
                            <p className="text-xs text-muted-foreground">Browser-based ML inference</p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-sm">Edge Computing</h5>
                            <p className="text-xs text-muted-foreground">Client-side threat detection</p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-sm">Streaming Analysis</h5>
                            <p className="text-xs text-muted-foreground">Continuous content monitoring</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Implementation Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Technical Implementation</h3>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="text-sm overflow-x-auto">{`// AI Model Integration with Hugging Face Transformers
import { pipeline } from "@huggingface/transformers";

class FraudDetectionAI {
  constructor() {
    this.textClassifier = null;
    this.imageClassifier = null;
    this.sentimentAnalyzer = null;
  }

  async initialize() {
    // Initialize NLP models
    this.textClassifier = await pipeline(
      "text-classification",
      "distilbert-base-uncased-finetuned-sst-2-english",
      { device: "webgpu" }
    );

    this.sentimentAnalyzer = await pipeline(
      "sentiment-analysis",
      "cardiffnlp/twitter-roberta-base-sentiment-latest",
      { device: "webgpu" }
    );

    // Initialize computer vision models
    this.imageClassifier = await pipeline(
      "image-classification",
      "onnx-community/mobilenetv4_conv_small.e2400_r224_in1k",
      { device: "webgpu" }
    );
  }

  async analyzeContent(text, imageUrl) {
    const textAnalysis = await this.analyzeText(text);
    const visualAnalysis = await this.analyzeImage(imageUrl);
    
    return this.calculateRiskScore(textAnalysis, visualAnalysis);
  }

  async analyzeText(text) {
    const [classification, sentiment] = await Promise.all([
      this.textClassifier(text),
      this.sentimentAnalyzer(text)
    ]);

    return {
      classification: classification[0],
      sentiment: sentiment[0],
      urgencyScore: this.detectUrgency(text),
      financialTerms: this.detectFinancialThreats(text)
    };
  }

  async analyzeImage(imageUrl) {
    const classification = await this.imageClassifier(imageUrl);
    
    return {
      uiElements: this.detectUIElements(classification),
      brandSimilarity: this.calculateBrandSimilarity(classification),
      layoutSuspicion: this.analyzeLayout(imageUrl)
    };
  }

  calculateRiskScore(textAnalysis, visualAnalysis) {
    const textWeight = 0.6;
    const visualWeight = 0.4;
    
    const textRisk = this.calculateTextRisk(textAnalysis);
    const visualRisk = this.calculateVisualRisk(visualAnalysis);
    
    return {
      overallRisk: (textRisk * textWeight + visualRisk * visualWeight),
      confidence: this.calculateConfidence(textAnalysis, visualAnalysis),
      threats: this.identifyThreats(textAnalysis, visualAnalysis)
    };
  }
}`}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Architecture */}
            <TabsContent value="architecture" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-6 w-6 text-primary" />
                    System Architecture Documentation
                  </CardTitle>
                  <CardDescription>
                    Technical structure, components, and data flow diagrams
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* High-Level Architecture */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">High-Level Architecture Diagram</h3>
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Monitor className="h-10 w-10 text-blue-500" />
                          </div>
                          <h4 className="font-semibold">Frontend Layer</h4>
                          <p className="text-xs text-muted-foreground mt-2">React + TypeScript<br/>Tailwind CSS<br/>Real-time UI</p>
                        </div>
                        <div className="text-center">
                          <div className="w-20 h-20 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Server className="h-10 w-10 text-purple-500" />
                          </div>
                          <h4 className="font-semibold">API Layer</h4>
                          <p className="text-xs text-muted-foreground mt-2">Supabase Edge Functions<br/>REST APIs<br/>WebSocket Connections</p>
                        </div>
                        <div className="text-center">
                          <div className="w-20 h-20 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Cpu className="h-10 w-10 text-green-500" />
                          </div>
                          <h4 className="font-semibold">AI Processing</h4>
                          <p className="text-xs text-muted-foreground mt-2">Hugging Face Models<br/>WebGPU Acceleration<br/>Edge Computing</p>
                        </div>
                        <div className="text-center">
                          <div className="w-20 h-20 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Database className="h-10 w-10 text-orange-500" />
                          </div>
                          <h4 className="font-semibold">Data Layer</h4>
                          <p className="text-xs text-muted-foreground mt-2">PostgreSQL Database<br/>Real-time Subscriptions<br/>Audit Logging</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Component Diagram */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Component/Module Diagram</h3>
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-card p-4 rounded-lg border">
                          <h5 className="font-semibold text-sm mb-2">Auth Module</h5>
                          <ul className="text-xs space-y-1">
                            <li>• User Authentication</li>
                            <li>• Role Management</li>
                            <li>• Session Handling</li>
                          </ul>
                        </div>
                        <div className="bg-card p-4 rounded-lg border">
                          <h5 className="font-semibold text-sm mb-2">Analysis Engine</h5>
                          <ul className="text-xs space-y-1">
                            <li>• NLP Processing</li>
                            <li>• Computer Vision</li>
                            <li>• Risk Scoring</li>
                          </ul>
                        </div>
                        <div className="bg-card p-4 rounded-lg border">
                          <h5 className="font-semibold text-sm mb-2">Alert System</h5>
                          <ul className="text-xs space-y-1">
                            <li>• Real-time Monitoring</li>
                            <li>• Notification Service</li>
                            <li>• Threat Response</li>
                          </ul>
                        </div>
                        <div className="bg-card p-4 rounded-lg border">
                          <h5 className="font-semibold text-sm mb-2">Data Management</h5>
                          <ul className="text-xs space-y-1">
                            <li>• Submission Tracking</li>
                            <li>• Analytics Storage</li>
                            <li>• User Preferences</li>
                          </ul>
                        </div>
                        <div className="bg-card p-4 rounded-lg border">
                          <h5 className="font-semibold text-sm mb-2">Admin Dashboard</h5>
                          <ul className="text-xs space-y-1">
                            <li>• System Monitoring</li>
                            <li>• User Management</li>
                            <li>• Audit Logs</li>
                          </ul>
                        </div>
                        <div className="bg-card p-4 rounded-lg border">
                          <h5 className="font-semibold text-sm mb-2">External APIs</h5>
                          <ul className="text-xs space-y-1">
                            <li>• WHOIS Lookup</li>
                            <li>• Threat Intelligence</li>
                            <li>• Brand Databases</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Flow Diagram */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Data Flow Diagrams (DFD)</h3>
                    <div className="space-y-6">
                      <div className="bg-muted/30 p-6 rounded-lg">
                        <h4 className="font-medium mb-4">URL Analysis Flow</h4>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex-1 min-w-[120px] text-center">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Globe className="h-8 w-8 text-blue-500" />
                            </div>
                            <p className="text-sm font-medium">User Input</p>
                            <p className="text-xs text-muted-foreground">URL Submission</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-[120px] text-center">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Network className="h-8 w-8 text-purple-500" />
                            </div>
                            <p className="text-sm font-medium">Content Fetch</p>
                            <p className="text-xs text-muted-foreground">HTML + Screenshot</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-[120px] text-center">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Brain className="h-8 w-8 text-green-500" />
                            </div>
                            <p className="text-sm font-medium">AI Analysis</p>
                            <p className="text-xs text-muted-foreground">NLP + Vision</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-[120px] text-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Database className="h-8 w-8 text-red-500" />
                            </div>
                            <p className="text-sm font-medium">Results Storage</p>
                            <p className="text-xs text-muted-foreground">Risk Assessment</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Real-Time Alerting */}
            <TabsContent value="real-time" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-primary" />
                    Real-Time Alerting System
                  </CardTitle>
                  <CardDescription>
                    How instant browser and application warnings work for detected threats
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Alert System Architecture */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Alert System Architecture</h3>
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Monitor className="h-10 w-10 text-blue-500" />
                          </div>
                          <h4 className="font-semibold">Detection Layer</h4>
                          <p className="text-xs text-muted-foreground mt-2">
                            Real-time content monitoring<br/>
                            AI-powered threat detection<br/>
                            Pattern recognition engine
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="w-20 h-20 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Zap className="h-10 w-10 text-orange-500" />
                          </div>
                          <h4 className="font-semibold">Alert Processing</h4>
                          <p className="text-xs text-muted-foreground mt-2">
                            WebSocket connections<br/>
                            Real-time event streaming<br/>
                            Priority-based routing
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="w-20 h-20 bg-red-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Bell className="h-10 w-10 text-red-500" />
                          </div>
                          <h4 className="font-semibold">Notification Delivery</h4>
                          <p className="text-xs text-muted-foreground mt-2">
                            Browser notifications<br/>
                            In-app alerts<br/>
                            Email notifications
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Browser Extension Integration */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Browser Extension Integration</h3>
                    <Card>
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">How It Works</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                Extension monitors page navigation in real-time
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                Automatically captures page content and screenshots
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                Sends data to AI analysis engine via secure API
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                Receives threat assessment within 2 seconds
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                Displays warning overlay for high-risk sites
                              </li>
                            </ul>
                          </div>
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-3">Extension Architecture</h4>
                            <pre className="text-xs overflow-x-auto">{`// Background script
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const analysis = await analyzeURL(tab.url);
    
    if (analysis.riskScore > 0.7) {
      // Show warning immediately
      chrome.tabs.sendMessage(tabId, {
        action: 'showWarning',
        data: analysis
      });
      
      // Store in user's history
      chrome.storage.local.set({
        ['threat_' + Date.now()]: analysis
      });
    }
  }
});

// Content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'showWarning') {
    displayThreatWarning(message.data);
  }
});`}</pre>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* WebSocket Real-Time Communication */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">WebSocket Real-Time Communication</h3>
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-3">Real-Time Alert Flow</h4>
                            <pre className="text-sm overflow-x-auto">{`// Client-side WebSocket connection
const alertSocket = new WebSocket('wss://api.fraudguard.ai/alerts');

alertSocket.onopen = () => {
  // Subscribe to user-specific alerts
  alertSocket.send(JSON.stringify({
    action: 'subscribe',
    userId: currentUser.id,
    alertTypes: ['high_risk', 'medium_risk', 'brand_impersonation']
  }));
};

alertSocket.onmessage = (event) => {
  const alert = JSON.parse(event.data);
  
  switch(alert.type) {
    case 'high_risk':
      showCriticalAlert(alert);
      break;
    case 'medium_risk':
      showWarningNotification(alert);
      break;
    case 'brand_impersonation':
      showBrandWarning(alert);
      break;
  }
};

// Server-side alert broadcasting
const broadcastAlert = (userId, alertData) => {
  const userConnections = getActiveConnections(userId);
  
  userConnections.forEach(connection => {
    connection.send(JSON.stringify({
      timestamp: new Date().toISOString(),
      severity: alertData.riskLevel,
      threat: alertData.threatCategory,
      url: alertData.url,
      evidence: alertData.supportingEvidence,
      actionRequired: alertData.recommendedActions
    }));
  });
};`}</pre>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Alert Types and Responses */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Alert Types and Response Actions</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="border-l-4 border-l-red-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base text-red-700">Critical Threats</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-2">
                            <li>• Immediate page blocking</li>
                            <li>• Full-screen warning overlay</li>
                            <li>• Admin notification</li>
                            <li>• Automatic threat reporting</li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base text-orange-700">Medium Risk</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-2">
                            <li>• Warning banner display</li>
                            <li>• User choice to proceed</li>
                            <li>• Risk explanation popup</li>
                            <li>• Educational resources</li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-l-4 border-l-yellow-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base text-yellow-700">Low Risk</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-2">
                            <li>• Subtle notification icon</li>
                            <li>• Optional detailed report</li>
                            <li>• Background monitoring</li>
                            <li>• User feedback collection</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Computer Vision */}
            <TabsContent value="computer-vision" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-6 w-6 text-primary" />
                    Computer Vision System
                  </CardTitle>
                  <CardDescription>
                    Advanced visual analysis for brand detection and UI comparison
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Computer Vision Pipeline */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Computer Vision Processing Pipeline</h3>
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Camera className="h-8 w-8 text-blue-500" />
                          </div>
                          <h4 className="font-semibold text-sm">Screenshot Capture</h4>
                          <p className="text-xs text-muted-foreground mt-1">html2canvas + Puppeteer</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Eye className="h-8 w-8 text-purple-500" />
                          </div>
                          <h4 className="font-semibold text-sm">Image Preprocessing</h4>
                          <p className="text-xs text-muted-foreground mt-1">Normalization + Enhancement</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Brain className="h-8 w-8 text-green-500" />
                          </div>
                          <h4 className="font-semibold text-sm">AI Analysis</h4>
                          <p className="text-xs text-muted-foreground mt-1">MobileNetV4 + YOLO</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Target className="h-8 w-8 text-orange-500" />
                          </div>
                          <h4 className="font-semibold text-sm">Feature Extraction</h4>
                          <p className="text-xs text-muted-foreground mt-1">Logo + UI Elements</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Gauge className="h-8 w-8 text-red-500" />
                          </div>
                          <h4 className="font-semibold text-sm">Similarity Scoring</h4>
                          <p className="text-xs text-muted-foreground mt-1">Brand Comparison</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technical Implementation */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Technical Implementation Details</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Screenshot Capture Process</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <pre className="text-xs overflow-x-auto">{`// Browser-based screenshot capture
import html2canvas from 'html2canvas';

async function captureScreenshot(url) {
  // Load page in hidden iframe
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  await new Promise(resolve => {
    iframe.onload = resolve;
  });
  
  // Capture screenshot
  const canvas = await html2canvas(iframe.contentDocument.body, {
    useCORS: true,
    allowTaint: false,
    scale: 1,
    width: 1920,
    height: 1080
  });
  
  // Convert to blob for analysis
  return new Promise(resolve => {
    canvas.toBlob(resolve, 'image/png', 0.95);
  });
}`}</pre>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Brand Logo Detection</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <pre className="text-xs overflow-x-auto">{`// Logo detection with YOLO
import { pipeline } from "@huggingface/transformers";

class LogoDetector {
  constructor() {
    this.detector = null;
  }
  
  async initialize() {
    this.detector = await pipeline(
      "object-detection",
      "hustvl/yolos-tiny",
      { device: "webgpu" }
    );
  }
  
  async detectLogos(imageBlob) {
    const detections = await this.detector(imageBlob);
    
    return detections
      .filter(d => d.score > 0.7)
      .map(detection => ({
        logo: detection.label,
        confidence: detection.score,
        bbox: detection.box,
        brandMatch: this.matchToBrand(detection.label)
      }));
  }
  
  matchToBrand(logo) {
    const brandDatabase = {
      'apple': { risk: 'high', commonTargets: ['banking', 'payments'] },
      'google': { risk: 'high', commonTargets: ['login', 'accounts'] },
      'microsoft': { risk: 'medium', commonTargets: ['office', 'cloud'] }
    };
    
    return brandDatabase[logo.toLowerCase()] || null;
  }
}`}</pre>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Brand Similarity Analysis */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Brand Similarity Analysis</h3>
                    <Card>
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">Analysis Methods</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                <span><strong>Color Palette Analysis:</strong> Extract dominant colors and compare with brand guidelines</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                <span><strong>Typography Detection:</strong> Identify fonts and text styling patterns</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                <span><strong>Layout Comparison:</strong> Analyze UI element positioning and structure</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                <span><strong>Logo Matching:</strong> Deep learning-based logo identification and similarity scoring</span>
                              </li>
                            </ul>
                          </div>
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-3">Similarity Algorithm</h4>
                            <pre className="text-xs overflow-x-auto">{`// Brand similarity calculation
function calculateBrandSimilarity(analysis, brandReference) {
  const weights = {
    logo: 0.4,
    colors: 0.3,
    layout: 0.2,
    typography: 0.1
  };
  
  const scores = {
    logo: compareLogos(analysis.logos, brandReference.logos),
    colors: compareColorPalettes(analysis.colors, brandReference.colors),
    layout: compareLayouts(analysis.layout, brandReference.layout),
    typography: compareFonts(analysis.fonts, brandReference.fonts)
  };
  
  const overallSimilarity = Object.entries(weights)
    .reduce((total, [key, weight]) => {
      return total + (scores[key] * weight);
    }, 0);
  
  return {
    overallSimilarity,
    individualScores: scores,
    riskLevel: overallSimilarity > 0.8 ? 'high' : 
               overallSimilarity > 0.6 ? 'medium' : 'low',
    confidence: calculateConfidence(analysis)
  };
}`}</pre>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* UI Element Detection */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">UI Element Detection & Analysis</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Form Elements</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-1">
                            <li>• Login forms</li>
                            <li>• Payment inputs</li>
                            <li>• Personal data fields</li>
                            <li>• Submit buttons</li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Trust Indicators</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-1">
                            <li>• SSL certificates</li>
                            <li>• Security badges</li>
                            <li>• Contact information</li>
                            <li>• Terms of service</li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Suspicious Elements</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-1">
                            <li>• Urgent countdown timers</li>
                            <li>• Fake notifications</li>
                            <li>• Hidden download links</li>
                            <li>• Misleading buttons</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="solution" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    Solution & Benefits
                  </CardTitle>
                  <CardDescription>
                    Comprehensive fraud detection solution with real-time protection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Key Benefits</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <strong>Real-time Protection:</strong> Instant threat detection and user warnings
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <strong>AI-Powered Analysis:</strong> Advanced NLP and computer vision for accurate detection
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <strong>Multi-layered Security:</strong> Text, visual, and behavioral analysis combined
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <strong>User Education:</strong> Interactive learning and awareness building
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Technical Advantages</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <strong>Edge Computing:</strong> Client-side processing for privacy and speed
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <strong>Scalable Architecture:</strong> Cloud-native design for enterprise deployment
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <strong>API Integration:</strong> Easy integration with existing security infrastructure
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <strong>Continuous Learning:</strong> ML models that improve with new threat data
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ux" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    User Experience Design
                  </CardTitle>
                  <CardDescription>
                    Intuitive interface design with seamless threat detection integration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Intuitive Interface</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Clean, modern design that makes complex security analysis accessible to all users
                        </p>
                        <ul className="text-xs space-y-1">
                          <li>• One-click URL analysis</li>
                          <li>• Visual threat indicators</li>
                          <li>• Progressive disclosure</li>
                          <li>• Mobile-responsive design</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Real-time Feedback</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Instant visual feedback and clear explanations of threat assessments
                        </p>
                        <ul className="text-xs space-y-1">
                          <li>• Color-coded risk levels</li>
                          <li>• Animated loading states</li>
                          <li>• Contextual help tooltips</li>
                          <li>• Progress indicators</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Educational Focus</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Built-in learning resources and explanations to improve user security awareness
                        </p>
                        <ul className="text-xs space-y-1">
                          <li>• Interactive tutorials</li>
                          <li>• Threat explanation cards</li>
                          <li>• Security tips integration</li>
                          <li>• Knowledge base access</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="business" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    Business Opportunity & Market Analysis
                  </CardTitle>
                  <CardDescription>
                    Market potential, financial feasibility, and growth opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-green-500" />
                          Market Opportunity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-semibold text-sm">Global Cybersecurity Market</h5>
                            <p className="text-xs text-muted-foreground">$345B by 2026, growing at 12.5% CAGR</p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-sm">Fraud Detection Segment</h5>
                            <p className="text-xs text-muted-foreground">$48B market with 15% annual growth</p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-sm">AI Security Solutions</h5>
                            <p className="text-xs text-muted-foreground">Fastest growing segment at 23% CAGR</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Target className="h-5 w-5 text-blue-500" />
                          Revenue Streams
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-semibold text-sm">SaaS Subscriptions</h5>
                            <p className="text-xs text-muted-foreground">Tiered pricing for individuals and enterprises</p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-sm">API Licensing</h5>
                            <p className="text-xs text-muted-foreground">Usage-based pricing for developers</p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-sm">Enterprise Solutions</h5>
                            <p className="text-xs text-muted-foreground">Custom deployments and consulting</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scalability" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-6 w-6 text-primary" />
                    Scalability & Reusability
                  </CardTitle>
                  <CardDescription>
                    Modular architecture supporting enterprise-scale deployment and component reusability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Horizontal Scaling</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            Microservices architecture for independent scaling
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            Container-based deployment with Kubernetes
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            Auto-scaling based on demand patterns
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            Global CDN for low-latency access
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Component Reusability</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            Modular AI components for different use cases
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            Reusable UI components and design system
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            API-first architecture for integration
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            White-label solutions for partners
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Documentation;
