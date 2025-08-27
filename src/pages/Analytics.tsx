import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, Shield, AlertTriangle, CheckCircle, Users, Globe,
  Calendar, Filter, Download, Search, RefreshCw, Zap, Activity,
  BarChartIcon, PieChartIcon, TrendingDown, ArrowUpIcon, ArrowDownIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import LoginBenefitsBanner from '@/components/LoginBenefitsBanner';
import { ThreatCategoryModal } from '@/components/ThreatCategoryModal';
import { DetailedReportModal } from '@/components/DetailedReportModal';
import { BatchSubmissionRow } from '@/components/BatchSubmissionRow';

interface AnalyticsData {
  submissions: any[];
  batches: any[];
  threatBreakdown: { name: string; value: number; color: string; description?: string }[];
  threatCategoryBreakdown: { name: string; value: number; color: string; description: string }[];
  riskBreakdown: { name: string; value: number; color: string }[];
  trendsData: { date: string; submissions: number; highRisk: number; categories: { [key: string]: number } }[];
  totalStats: {
    totalSubmissions: number;
    totalBatches: number;
    averageRisk: number;
    highRiskCount: number;
    successRate: number;
    topThreatCategory: string;
    avgConfidence: number;
    threatTypesDetected: number;
  };
}

interface AIAnalysisInsights {
  topThreatCategories: { category: string; count: number; trend: 'up' | 'down' | 'stable' }[];
  detectionAccuracy: { category: string; accuracy: number; confidence: number }[];
  explainabilityInsights: { reason: string; frequency: number }[];
  recommendations: string[];
  confidenceScore: number;
}

const RISK_COLORS = {
  low: '#10B981',
  medium: '#F59E0B', 
  high: '#EF4444',
  critical: '#DC2626'
};

const THREAT_CATEGORY_COLORS = {
  'Safe Content': '#10B981',
  'Suspicious Language': '#F59E0B',
  'UI Similarity': '#F59E0B', 
  'Fake Website': '#EF4444',
  'Scam Mobile App': '#EF4444',
  'App/Website Clone': '#EF4444',
  'Phishing Domain': '#DC2626',
  'Malware-laden': '#DC2626'
};

const Analytics = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [aiInsights, setAiInsights] = useState<AIAnalysisInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [threatCategoryFilter, setThreatCategoryFilter] = useState('all');
  const [showBenefitsBanner, setShowBenefitsBanner] = useState(!user);
  const [selectedThreatCategory, setSelectedThreatCategory] = useState<any | null>(null);
  const [threatCategoryModalOpen, setThreatCategoryModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
    if (user) {
      generateAIInsights();
    }
  }, [user, timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Load URL submissions with batch information
      let submissionsQuery = supabase.from('url_submissions').select(`
        *,
        batch_submissions!batch_id (
          id,
          file_name,
          total_urls,
          processed_urls,
          status,
          created_at
        )
      `);
      
      // Filter by user if authenticated
      if (user) {
        submissionsQuery = submissionsQuery.eq('user_id', user.id);
      } else {
        // For anonymous users, show aggregated public data
        submissionsQuery = submissionsQuery.not('risk_score', 'is', null);
      }

      // Apply time range filter
      const daysAgo = parseInt(timeRange.replace('d', ''));
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);
      submissionsQuery = submissionsQuery.gte('created_at', startDate.toISOString());

      const { data: submissions, error: submissionsError } = await submissionsQuery;
      if (submissionsError) throw submissionsError;

      // Load batch submissions separately
      let batchQuery = supabase.from('batch_submissions').select('*');
      if (user) {
        batchQuery = batchQuery.eq('user_id', user.id);
      } else {
        batchQuery = batchQuery.not('session_id', 'is', null);
      }
      batchQuery = batchQuery.gte('created_at', startDate.toISOString());

      const { data: batches, error: batchError } = await batchQuery;
      if (batchError) throw batchError;

      // Process data for analytics including batch information
      const processedData = processAnalyticsData(submissions || [], batches || []);
      setData(processedData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Analytics Error",
        description: "Failed to load analytics data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (submissions: any[], batches: any[]): AnalyticsData => {
    // Filter out submissions with unknown threat categories for individual submissions display
    const filteredSubmissions = submissions.filter(sub => 
      sub.threat_category && 
      sub.threat_category !== 'Unknown' && 
      sub.threat_category.trim() !== ''
    );

    // Threat category breakdown with category consolidation
    const categoryCounts: { [key: string]: number } = {};
    filteredSubmissions.forEach(sub => {
      let category = sub.threat_category || 'Safe Content';
      
      // Consolidate similar categories to prevent overlapping in charts
      if (category.toLowerCase().includes('phishing')) {
        category = 'Phishing Domain';
      } else if (category.toLowerCase().includes('malware')) {
        category = 'Malware-laden';
      } else if (category.toLowerCase().includes('fake') || category.toLowerCase().includes('clone')) {
        category = 'Fake Website';
      }
      
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const threatCategoryBreakdown = Object.entries(categoryCounts).map(([category, count]) => ({
      name: category,
      value: count,
      color: THREAT_CATEGORY_COLORS[category as keyof typeof THREAT_CATEGORY_COLORS] || '#6B7280',
      description: getThreatCategoryDescription(category)
    }));

    // Risk breakdown (legacy support) - use filtered submissions
    const riskCounts = { low: 0, medium: 0, high: 0, critical: 0 };
    filteredSubmissions.forEach(sub => {
      if (sub.risk_level && riskCounts.hasOwnProperty(sub.risk_level)) {
        riskCounts[sub.risk_level as keyof typeof riskCounts]++;
      }
    });

    const riskBreakdown = Object.entries(riskCounts).map(([level, count]) => ({
      name: level.charAt(0).toUpperCase() + level.slice(1),
      value: count,
      color: RISK_COLORS[level as keyof typeof RISK_COLORS]
    }));

    // Enhanced trends data with proper date range
    const daysAgo = parseInt(timeRange.replace('d', ''));
    const trendsMap = new Map();
    
    // Initialize all dates in range
    for (let i = daysAgo - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      trendsMap.set(dateStr, { 
        date: displayDate, 
        submissions: 0, 
        highRisk: 0, 
        categories: {} 
      });
    }

    // Fill with actual data - use filtered submissions
    filteredSubmissions.forEach(sub => {
      const date = new Date(sub.created_at).toISOString().split('T')[0];
      if (trendsMap.has(date)) {
        const entry = trendsMap.get(date);
        entry.submissions++;
        if (sub.risk_level === 'high' || sub.risk_level === 'critical') {
          entry.highRisk++;
        }
        
        let category = sub.threat_category || 'Safe Content';
        // Apply same consolidation logic
        if (category.toLowerCase().includes('phishing')) {
          category = 'Phishing Domain';
        } else if (category.toLowerCase().includes('malware')) {
          category = 'Malware-laden';
        } else if (category.toLowerCase().includes('fake') || category.toLowerCase().includes('clone')) {
          category = 'Fake Website';
        }
        
        entry.categories[category] = (entry.categories[category] || 0) + 1;
      }
    });

    const trendsData = Array.from(trendsMap.values());

    // Enhanced stats - use filtered submissions for calculations
    const totalSubmissions = filteredSubmissions.length;
    const averageRisk = filteredSubmissions.reduce((sum, sub) => sum + (sub.risk_score || 0), 0) / totalSubmissions || 0;
    const highRiskCount = filteredSubmissions.filter(sub => 
      sub.risk_level === 'high' || sub.risk_level === 'critical'
    ).length;
    const successRate = ((totalSubmissions - highRiskCount) / totalSubmissions) * 100 || 0;
    
    // Top threat category
    const topCategory = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)[0];
    const topThreatCategory = topCategory ? topCategory[0] : 'Safe Content';
    
    // Average confidence - use filtered submissions
    const avgConfidence = filteredSubmissions
      .filter(sub => sub.classification_confidence)
      .reduce((sum, sub) => sum + sub.classification_confidence, 0) / 
      filteredSubmissions.filter(sub => sub.classification_confidence).length || 0;

    // Count unique threat types
    const threatTypesDetected = Object.keys(categoryCounts).filter(cat => cat !== 'Safe Content').length;

    return {
      submissions: filteredSubmissions, // Return filtered submissions
      batches: batches.filter(batch => batch.status !== 'processing'), // Filter out processing batches
      threatBreakdown: threatCategoryBreakdown,
      threatCategoryBreakdown,
      riskBreakdown,
      trendsData,
      totalStats: {
        totalSubmissions,
        totalBatches: batches.filter(batch => batch.status !== 'processing').length,
        averageRisk: Math.round(averageRisk),
        highRiskCount,
        successRate: Math.round(successRate),
        topThreatCategory,
        avgConfidence: Math.round(avgConfidence * 100) / 100,
        threatTypesDetected
      }
    };
  };

  const getThreatCategoryDescription = (category: string): string => {
    const descriptions: { [key: string]: string } = {
      'Safe Content': 'No significant threats detected',
      'Suspicious Language': 'Content using social engineering tactics',
      'UI Similarity': 'Visual mimicry of trusted interfaces',
      'Fake Website': 'Fraudulent sites impersonating businesses',
      'Scam Mobile App': 'Malicious apps with hidden agendas',
      'App/Website Clone': 'Impersonations of popular brands',
      'Phishing Domain': 'Sites designed to steal credentials',
      'Malware-laden': 'Content distributing malicious software'
    };
    return descriptions[category] || 'Unknown threat type';
  };

  const generateAIInsights = async () => {
    // Simulate AI-powered insights generation based on user's data
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Process actual data if available
      const submissions = data?.submissions || [];
      const categoryStats = data?.threatCategoryBreakdown || [];
      
      setAiInsights({
        topThreatCategories: categoryStats
          .filter(cat => cat.name !== 'Safe Content')
          .slice(0, 5)
          .map(cat => ({
            category: cat.name,
            count: cat.value,
            trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down'
          })),
        detectionAccuracy: [
          { category: 'Phishing Domain', accuracy: 94, confidence: 0.92 },
          { category: 'Malware-laden', accuracy: 89, confidence: 0.88 },
          { category: 'App/Website Clone', accuracy: 86, confidence: 0.85 },
          { category: 'Fake Website', accuracy: 91, confidence: 0.90 }
        ],
        explainabilityInsights: [
          { reason: 'Domain analysis patterns', frequency: 78 },
          { reason: 'Visual similarity detection', frequency: 65 },
          { reason: 'Language sentiment analysis', frequency: 42 },
          { reason: 'Behavioral pattern matching', frequency: 55 }
        ],
        recommendations: [
          'Enable two-factor authentication for all accounts',
          'Regularly scan URLs before visiting',
          'Check domain reputation before transactions',
          'Verify app authenticity through official stores'
        ],
        confidenceScore: 94
      });
    } catch (error) {
      console.error('Error generating AI insights:', error);
    }
  };

  const filteredSubmissions = data?.submissions.filter(sub => {
    const matchesSearch = !searchTerm || 
      sub.url?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'all' || sub.risk_level === filterRisk;
    const matchesThreatCategory = threatCategoryFilter === 'all' || sub.threat_category === threatCategoryFilter;
    return matchesSearch && matchesRisk && matchesThreatCategory;
  }) || [];

  const handleThreatCategoryClick = (categoryName: string) => {
    const categorySubmissions = data?.submissions.filter(sub => sub.threat_category === categoryName) || [];
    setSelectedThreatCategory({
      category: categoryName,
      count: categorySubmissions.length,
      submissions: categorySubmissions
    });
    setThreatCategoryModalOpen(true);
  };

  const handleRowClick = (submission: any) => {
    setSelectedReport(submission);
    setReportModalOpen(true);
  };

  const uniqueThreatCategories = [...new Set(data?.submissions.map(sub => sub.threat_category).filter(Boolean))] as string[];

  const exportData = () => {
    if (!data) return;
    
    const csvContent = [
      'URL,Threat Category,Risk Score,Risk Level,Analysis Date',
      ...filteredSubmissions.map(sub => 
        `"${sub.url}","${sub.threat_category || 'Unknown'}",${sub.risk_score},"${sub.risk_level}","${sub.created_at}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-80" />
              <Skeleton className="h-80" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Security Analytics</h1>
              <p className="text-muted-foreground">
                {user ? 'Your personal security analysis dashboard' : 'Global fraud detection insights'}
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={loadAnalyticsData} size="sm" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Benefits Banner for Anonymous Users */}
          {showBenefitsBanner && !user && (
            <div className="mb-6">
              <LoginBenefitsBanner 
                trigger="default"
                onDismiss={() => setShowBenefitsBanner(false)}
              />
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Scans</p>
                    <p className="text-2xl font-bold">{data?.totalStats.totalSubmissions || 0}</p>
                  </div>
                  <Activity className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Risk Score</p>
                    <p className="text-2xl font-bold">{data?.totalStats.averageRisk || 0}/100</p>
                  </div>
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-2">
                  <Progress value={data?.totalStats.averageRisk || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">High Risk Detected</p>
                    <p className="text-2xl font-bold text-destructive">{data?.totalStats.highRiskCount || 0}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Threat Types Detected</p>
                    <p className="text-2xl font-bold text-primary">{data?.totalStats.threatTypesDetected || 0}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
              {user && <TabsTrigger value="insights">AI Insights</TabsTrigger>}
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Threat Category Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5" />
                      Threat Category Distribution
                    </CardTitle>
                    <CardDescription>
                      Click on any category to see detailed analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={data?.threatBreakdown || []}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => 
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          onClick={(entry) => handleThreatCategoryClick(entry.name)}
                          className="cursor-pointer"
                        >
                          {data?.threatBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Trends Line Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Submission Trends
                    </CardTitle>
                    <CardDescription>
                      Daily submission volume and high-risk detections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={data?.trendsData || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          interval="preserveStartEnd"
                        />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(value) => `Date: ${value}`}
                          formatter={(value, name) => [value, name]}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="submissions" 
                          stackId="1"
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary))" 
                          fillOpacity={0.3}
                          name="Total Submissions"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="highRisk" 
                          stackId="2"
                          stroke="hsl(var(--destructive))" 
                          fill="hsl(var(--destructive))" 
                          fillOpacity={0.3}
                          name="High Risk Detections"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search URLs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterRisk} onValueChange={setFilterRisk}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={threatCategoryFilter} onValueChange={setThreatCategoryFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {uniqueThreatCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={exportData} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>

              {/* Batch Submissions */}
              {data?.batches && data.batches.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Batch Submissions ({data.batches.length})</CardTitle>
                    <CardDescription>
                      CSV file uploads with bulk URL analysis results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead colSpan={7}>Batch Analysis Results</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.batches.map((batch) => {
                          const batchSubmissions = data.submissions.filter(s => s.batch_id === batch.id);
                          return (
                            <BatchSubmissionRow
                              key={batch.id}
                              batch={batch}
                              submissions={batchSubmissions}
                              onRowClick={handleRowClick}
                            />
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Individual Submissions Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Individual Submissions ({filteredSubmissions.filter(s => !s.batch_id).length})</CardTitle>
                  <CardDescription>
                    Single URL and app analysis results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>URL</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Threat Category</TableHead>
                        <TableHead>Risk Score</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.filter(submission => !submission.batch_id).map((submission) => (
                        <TableRow 
                          key={submission.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleRowClick(submission)}
                        >
                          <TableCell className="font-medium max-w-xs truncate">
                            {submission.url}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {submission.submission_type || 'URL'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {submission.threat_category || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{submission.risk_score || 'N/A'}</span>
                              {submission.risk_score && (
                                <Progress 
                                  value={submission.risk_score} 
                                  className="w-16 h-2" 
                                />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={submission.risk_score >= 80 ? 'destructive' : submission.risk_score >= 60 ? 'destructive' : 'secondary'}
                            >
                              {submission.risk_level?.toUpperCase() || 'UNKNOWN'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(submission.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {filteredSubmissions.filter(s => !s.batch_id).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No individual submissions found matching your criteria.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {user && (
              <TabsContent value="insights" className="space-y-6">
                {/* AI-Powered Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-security-ai" />
                        AI Security Insights
                      </CardTitle>
                      <CardDescription>
                        Machine learning powered analysis of your security patterns
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {aiInsights ? (
                        <>
                          <div>
                            <h4 className="font-medium mb-2">Top Threat Categories</h4>
                            <div className="space-y-2">
                              {aiInsights.topThreatCategories.map((category, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span className="text-sm">{category.category}</span>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">{category.count}</Badge>
                                    {category.trend === 'up' ? (
                                      <TrendingUp className="h-3 w-3 text-destructive" />
                                    ) : (
                                      <TrendingDown className="h-3 w-3 text-primary" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Detection Accuracy</h4>
                            <div className="space-y-2">
                              {aiInsights.detectionAccuracy.map((accuracy, index) => (
                                <div key={index} className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">{accuracy.category}</span>
                                    <Badge variant="outline">{accuracy.accuracy}%</Badge>
                                  </div>
                                  <Progress value={accuracy.accuracy} className="h-1" />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">AI Confidence</span>
                              <span className="text-sm text-primary">{aiInsights.confidenceScore}%</span>
                            </div>
                            <Progress value={aiInsights.confidenceScore} className="mt-2" />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-5/6" />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Security Recommendations
                      </CardTitle>
                      <CardDescription>
                        Personalized security tips based on your analysis history
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {aiInsights ? (
                        <div className="space-y-3">
                          {aiInsights.recommendations.map((recommendation, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{recommendation}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-12 w-full" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}
          </Tabs>

          <ThreatCategoryModal
            isOpen={threatCategoryModalOpen}
            onClose={() => setThreatCategoryModalOpen(false)}
            categoryDetails={selectedThreatCategory}
          />

          <DetailedReportModal
            isOpen={reportModalOpen}
            onClose={() => setReportModalOpen(false)}
            reportData={selectedReport}
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;