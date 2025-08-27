import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Key, Shield, Zap } from "lucide-react";

const API = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">API Access</h1>
            <p className="text-xl text-muted-foreground">
              Integrate our AI-powered fraud detection into your applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Real-time Analysis
                </CardTitle>
                <CardDescription>
                  Analyze URLs and content instantly with our REST API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">
                    POST /api/v1/analyze<br/>
                    {`{ "url": "https://example.com" }`}
                  </code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Batch Processing
                </CardTitle>
                <CardDescription>
                  Submit multiple URLs for analysis in a single request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">
                    POST /api/v1/batch<br/>
                    {`{ "urls": ["url1", "url2"] }`}
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>API Features</CardTitle>
                <CardDescription>Comprehensive fraud detection capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Easy Integration</h3>
                    <p className="text-sm text-muted-foreground">Simple REST API with comprehensive documentation</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Key className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Secure Authentication</h3>
                    <p className="text-sm text-muted-foreground">API key-based authentication with rate limiting</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Fast Response</h3>
                    <p className="text-sm text-muted-foreground">Average response time under 2 seconds</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing Plans</CardTitle>
                <CardDescription>Choose the plan that fits your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Starter</h3>
                      <p className="text-2xl font-bold">$29/mo</p>
                      <p className="text-sm text-muted-foreground">Up to 1,000 requests</p>
                    </div>
                    <Badge variant="outline">Basic Support</Badge>
                  </div>
                  <div className="border rounded-lg p-6 border-primary">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Professional</h3>
                      <p className="text-2xl font-bold">$99/mo</p>
                      <p className="text-sm text-muted-foreground">Up to 10,000 requests</p>
                    </div>
                    <Badge>Priority Support</Badge>
                  </div>
                  <div className="border rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Enterprise</h3>
                      <p className="text-2xl font-bold">Custom</p>
                      <p className="text-sm text-muted-foreground">Unlimited requests</p>
                    </div>
                    <Badge variant="outline">24/7 Support</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Contact our team to get your API key and start integrating today
            </p>
            <div className="flex justify-center gap-4">
              <Button>Get API Key</Button>
              <Button variant="outline">View Documentation</Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default API;