import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Search, Filter, Download, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const History = () => {
  const { user } = useAuth();

  // Sample data - this would come from your database
  const analysisHistory = [
    {
      id: "1",
      url: "https://suspicious-bank-login.com",
      threatCategory: "Phishing Domain",
      riskScore: 87,
      riskLevel: "high",
      analyzedAt: "2025-01-15T10:30:00Z",
      status: "completed"
    },
    {
      id: "2", 
      url: "https://legitimate-ecommerce.com",
      threatCategory: "Safe Content",
      riskScore: 12,
      riskLevel: "low",
      analyzedAt: "2025-01-15T09:15:00Z",
      status: "completed"
    },
    {
      id: "3",
      url: "https://fake-crypto-exchange.net",
      threatCategory: "Fake Website", 
      riskScore: 94,
      riskLevel: "critical",
      analyzedAt: "2025-01-14T16:45:00Z",
      status: "completed"
    }
  ];

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Analysis History</h1>
            <p className="text-muted-foreground mb-8">
              Sign in to view your personal analysis history and track your security scans over time.
            </p>
            <Button asChild>
              <a href="/auth">Sign In to View History</a>
            </Button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analysis History</h1>
              <p className="text-muted-foreground">
                Track and review all your security analyses
              </p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export History
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by URL..." className="pl-10" />
                  </div>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="critical">Critical Risk</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="30d">
                  <SelectTrigger className="md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* History List */}
          <div className="space-y-4">
            {analysisHistory.map((analysis) => (
              <Card key={analysis.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium truncate">{analysis.url}</h3>
                        <Badge variant={getRiskBadgeVariant(analysis.riskLevel)}>
                          {analysis.riskLevel.charAt(0).toUpperCase() + analysis.riskLevel.slice(1)} Risk
                        </Badge>
                        <Badge variant="outline">
                          {analysis.threatCategory}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(analysis.analyzedAt)}
                        </div>
                        <div>
                          Risk Score: <span className="font-medium">{analysis.riskScore}/100</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm">
                        View Report
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <div className="px-3 py-1 text-sm">Page 1 of 1</div>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>

          {/* Empty State (when no history) */}
          {analysisHistory.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Analysis History</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't analyzed any URLs yet. Start by submitting a URL for analysis.
                </p>
                <Button asChild>
                  <a href="/submit">Analyze Your First URL</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default History;