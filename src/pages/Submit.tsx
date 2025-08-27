import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, Link2, Smartphone, FileText, CheckCircle, AlertTriangle, Clock, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import LoginBenefitsBanner from '@/components/LoginBenefitsBanner';
import Header from '@/components/Header';
import AnalysisResultCard from '@/components/AnalysisResultCard';
import { simulateEnhancedAnalysis } from '@/lib/aiAnalysis';

const urlSchema = z.object({
  url: z.string().url('Please enter a valid URL (e.g., https://example.com)'),
  description: z.string().optional(),
});

const appSchema = z.object({
  storeUrl: z.string().url('Please enter a valid app store URL'),
  appName: z.string().min(1, 'App name is required'),
  description: z.string().optional(),
});

const batchSchema = z.object({
  csvFile: z.any().refine((files) => files?.length === 1, 'Please select a CSV file'),
});

type UrlForm = z.infer<typeof urlSchema>;
type AppForm = z.infer<typeof appSchema>;
type BatchForm = z.infer<typeof batchSchema>;

interface AnalysisResult {
  id: string;
  url: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  threatCategory: string;
  threatSubcategory?: string;
  primaryDetectionReason: string;
  classificationConfidence: number;
  status: 'completed' | 'processing' | 'failed';
  analysisResults: any;
}

const Submit = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [showBenefitsBanner, setShowBenefitsBanner] = useState(false);
  const { user } = useAuth();

  const urlForm = useForm<UrlForm>({
    resolver: zodResolver(urlSchema),
    defaultValues: { url: '', description: '' },
  });

  const appForm = useForm<AppForm>({
    resolver: zodResolver(appSchema),
    defaultValues: { storeUrl: '', appName: '', description: '' },
  });

  const batchForm = useForm<BatchForm>({
    resolver: zodResolver(batchSchema),
  });

  const generateSessionId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const simulateAnalysis = async (url: string): Promise<AnalysisResult> => {
    // Use enhanced AI analysis with progress updates
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const aiResult = await simulateEnhancedAnalysis(url);
    
    // Convert to the expected format for Submit page
    return {
      id: Math.random().toString(36).substring(2),
      url: url,
      riskScore: aiResult.riskScore || 50,
      riskLevel: aiResult.riskLevel || 'medium',
      threatCategory: aiResult.threatCategory || 'Safe Content',
      threatSubcategory: aiResult.threatSubcategory,
      primaryDetectionReason: aiResult.primaryDetectionReason || 'Automated analysis completed',
      classificationConfidence: aiResult.confidence || 0.85,
      status: 'completed' as const,
      analysisResults: {
        domainAge: aiResult.domainAge || 365,
        sslStatus: aiResult.sslStatus || 'valid',
        redirectCount: aiResult.redirectCount || 0,
        maliciousContent: aiResult.maliciousContent || false,
        phishingKeywords: aiResult.phishingKeywords || 0,
        riskFactors: aiResult.riskFactors || [],
        scanTimestamp: new Date().toISOString(),
        explainability: aiResult.explainability,
        supportingEvidence: aiResult.supportingEvidence,
        technicalDetails: aiResult.technicalDetails,
        mlAnalysis: aiResult.mlAnalysis
      }
    };
  };

  const handleUrlSubmit = async (data: UrlForm) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      const sessionId = user ? null : generateSessionId();
      
      // Store submission in database
      const { data: submission, error } = await supabase
        .from('url_submissions')
        .insert({
          user_id: user?.id || null,
          session_id: sessionId,
          url: data.url,
          submission_type: 'url',
          analysis_status: 'processing',
        })
        .select()
        .single();

      if (error) throw error;

      // Simulate progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Perform analysis
      const result = await simulateAnalysis(data.url);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);

      // Update submission with results
      await supabase
        .from('url_submissions')
        .update({
          analysis_status: 'completed',
          risk_score: result.riskScore,
          risk_level: result.riskLevel,
          threat_category: result.threatCategory,
          threat_subcategory: result.threatSubcategory,
          primary_detection_reason: result.primaryDetectionReason,
          classification_confidence: result.classificationConfidence,
          analysis_results: result.analysisResults,
          supporting_evidence: result.analysisResults.supportingEvidence || {},
        })
        .eq('id', submission.id);

      setResults([result]);
      urlForm.reset();

      toast({
        title: "Analysis Complete",
        description: `Risk level: ${result.riskLevel.toUpperCase()} (${result.riskScore}/100)`,
      });

      // Show benefits banner for anonymous users after analysis
      if (!user) {
        setTimeout(() => setShowBenefitsBanner(true), 1000);
      }

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const handleAppSubmit = async (data: AppForm) => {
    // Similar implementation for app analysis
    toast({
      title: "App Analysis",
      description: "App analysis coming soon!",
    });
  };

  const handleBatchSubmit = async (data: BatchForm) => {
    // Similar implementation for batch analysis
    toast({
      title: "Batch Analysis",
      description: "Batch analysis coming soon!",
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return CheckCircle;
      case 'medium': return Clock;
      case 'high': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Security Analysis</h1>
            <p className="text-muted-foreground">
              Submit URLs, apps, or batch files for comprehensive fraud detection analysis
            </p>
          </div>

          {/* Benefits Banner */}
          {showBenefitsBanner && (
            <div className="mb-6">
              <LoginBenefitsBanner 
                trigger="analysis-complete"
                onDismiss={() => setShowBenefitsBanner(false)}
              />
            </div>
          )}

          {/* Submission Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Submit for Analysis
              </CardTitle>
              <CardDescription>
                Choose your submission type and provide the necessary information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="url" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Website URL
                  </TabsTrigger>
                  <TabsTrigger value="app" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Mobile App
                  </TabsTrigger>
                  <TabsTrigger value="batch" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Batch Upload
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="url" className="space-y-4">
                  <Form {...urlForm}>
                    <form onSubmit={urlForm.handleSubmit(handleUrlSubmit)} className="space-y-4">
                      <FormField
                        control={urlForm.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://example.com" 
                                {...field}
                                disabled={isAnalyzing}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter the full URL including https:// or http://
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={urlForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe any suspicious behavior or concerns..."
                                {...field}
                                disabled={isAnalyzing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {isAnalyzing && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Analyzing website...</span>
                            <span>{analysisProgress}%</span>
                          </div>
                          <Progress value={analysisProgress} className="w-full" />
                        </div>
                      )}

                      <Button type="submit" disabled={isAnalyzing} className="w-full">
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Website'}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="app" className="space-y-4">
                  <Alert>
                    <Smartphone className="h-4 w-4" />
                    <AlertDescription>
                      App analysis feature coming soon! We'll support iOS App Store and Google Play Store links.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="batch" className="space-y-4">
                  <Alert>
                    <Upload className="h-4 w-4" />
                    <AlertDescription>
                      Batch upload feature coming soon! Upload CSV files with multiple URLs for bulk analysis.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Results Section */}
          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  Detailed security analysis for your submitted URLs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.map((result) => (
                  <AnalysisResultCard
                    key={result.id}
                    result={result}
                    showDetailed={true}
                    onShare={(result) => {
                      navigator.clipboard.writeText(
                        `Security Analysis Result for ${result.url}\nThreat Category: ${result.threatCategory}\nRisk Score: ${result.riskScore}/100\nDetection Reason: ${result.primaryDetectionReason}`
                      );
                      toast({
                        title: "Analysis Shared",
                        description: "Analysis details copied to clipboard",
                      });
                    }}
                    onDownload={(result) => {
                      const data = {
                        url: result.url,
                        riskScore: result.riskScore,
                        riskLevel: result.riskLevel,
                        analysisResults: result.analysisResults,
                        timestamp: new Date().toISOString()
                      };
                      
                      const blob = new Blob([JSON.stringify(data, null, 2)], {
                        type: 'application/json'
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `security-analysis-${result.id}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      
                      toast({
                        title: "Report Downloaded",
                        description: "Analysis report saved successfully",
                      });
                    }}
                  />
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Submit;