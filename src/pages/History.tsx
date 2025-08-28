import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, Search, Filter, Download, ExternalLink, Share } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const History = () => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all-categories");
  const [dateFilter, setDateFilter] = useState("30d");

  // Fetch user's analysis history from database
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('url_submissions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedData = data.map(item => ({
          id: item.id,
          url: item.url,
          threatCategory: item.threat_category || 'Unknown',
          riskScore: item.risk_score || 0,
          riskLevel: item.risk_level || 'unknown',
          analyzedAt: item.created_at,
          status: item.analysis_status || 'completed',
          analysisResults: item.analysis_results
        }));

        setAnalysisHistory(formattedData);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  // Filter history based on search and filters
  const filteredHistory = analysisHistory.filter(item => {
    const matchesSearch = item.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === "all" || item.riskLevel === riskFilter;
    const matchesCategory = categoryFilter === "all-categories" || 
      item.threatCategory.toLowerCase().includes(categoryFilter.replace('-', ' '));
    
    // Date filtering
    let matchesDate = true;
    if (dateFilter !== "all") {
      const itemDate = new Date(item.analyzedAt);
      const now = new Date();
      const daysAgo = parseInt(dateFilter.replace('d', ''));
      const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      matchesDate = itemDate >= cutoffDate;
    }

    return matchesSearch && matchesRisk && matchesCategory && matchesDate;
  });

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

  const exportHistory = () => {
    if (filteredHistory.length === 0) {
      alert('No data to export');
      return;
    }

    const csvData = filteredHistory.map(item => ({
      URL: item.url,
      'Threat Category': item.threatCategory,
      'Risk Level': item.riskLevel,
      'Risk Score': item.riskScore,
      'Analyzed At': formatDate(item.analyzedAt),
      'Status': item.status
    }));
    
    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(v => `"${v}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const shareAnalysis = (analysisId: string) => {
    const shareUrl = `${window.location.origin}/report/${analysisId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Share link copied to clipboard!');
    });
  };

  const openReportModal = (analysis: any) => {
    setSelectedReport(analysis);
    setIsReportModalOpen(true);
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
            <Button variant="outline" onClick={exportHistory}>
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
                    <Input 
                      placeholder="Search by URL..." 
                      className="pl-10" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={riskFilter} onValueChange={setRiskFilter}>
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
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-categories">All Categories</SelectItem>
                    <SelectItem value="phishing">Phishing Domain</SelectItem>
                    <SelectItem value="malware">Malware</SelectItem>
                    <SelectItem value="fake-website">Fake Website</SelectItem>
                    <SelectItem value="safe-content">Safe Content</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
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
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading history...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((analysis) => (
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
                      <Button variant="ghost" size="sm" onClick={() => openReportModal(analysis)}>
                        View Report
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => shareAnalysis(analysis.id)}>
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <div className="px-3 py-1 text-sm">Page 1 of 1</div>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>

          {/* Empty State (when no history) */}
          {!loading && filteredHistory.length === 0 && analysisHistory.length > 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search filters to find what you're looking for.
                </p>
              </CardContent>
            </Card>
          )}

          {!loading && analysisHistory.length === 0 && (
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

        {/* Report Modal */}
        <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detailed Analysis Report</DialogTitle>
              <DialogDescription>
                Complete security analysis for {selectedReport?.url}
              </DialogDescription>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Risk Assessment</h3>
                    <Badge variant={getRiskBadgeVariant(selectedReport.riskLevel)} className="mb-2">
                      {selectedReport.riskLevel.charAt(0).toUpperCase() + selectedReport.riskLevel.slice(1)} Risk
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Risk Score: {selectedReport.riskScore}/100
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Threat Category</h3>
                    <Badge variant="outline">{selectedReport.threatCategory}</Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Detection Details</h3>
                  <p className="text-sm text-muted-foreground">
                    This analysis was performed using our advanced AI models that examine multiple factors 
                    including domain reputation, content analysis, and behavioral patterns.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Recommendations</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {selectedReport.riskLevel === 'high' || selectedReport.riskLevel === 'critical' ? (
                      <>
                        <li>• Avoid entering personal information on this site</li>
                        <li>• Do not download files from this domain</li>
                        <li>• Report this site to relevant authorities</li>
                      </>
                    ) : (
                      <>
                        <li>• This site appears to be safe for general browsing</li>
                        <li>• Still exercise caution with personal information</li>
                        <li>• Verify SSL certificates before entering sensitive data</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  );
};

export default History;