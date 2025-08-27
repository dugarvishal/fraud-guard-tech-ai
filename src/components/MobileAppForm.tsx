import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Shield, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { mobileAppAnalyzer } from "@/lib/mobileAppAnalysis";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { AppAnalysisResult, AppMetadata } from "@/lib/mobileAppAnalysis";

const appSchema = z.object({
  appStoreUrl: z.string().url().refine(
    (url) => url.includes("play.google.com") || url.includes("apps.apple.com"),
    "Must be a valid Google Play Store or Apple App Store URL"
  ),
  description: z.string().optional(),
});

type AppForm = z.infer<typeof appSchema>;

interface MobileAppFormProps {
  onAnalysisComplete?: (result: AppAnalysisResult) => void;
}

export function MobileAppForm({ onAnalysisComplete }: MobileAppFormProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [result, setResult] = useState<AppAnalysisResult | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<AppForm>({
    resolver: zodResolver(appSchema),
    defaultValues: {
      appStoreUrl: "",
      description: "",
    },
  });

  const extractAppInfo = (url: string) => {
    const isPlayStore = url.includes("play.google.com");
    const isAppStore = url.includes("apps.apple.com");
    
    if (isPlayStore) {
      const match = url.match(/id=([^&]+)/);
      return {
        appId: match?.[1] || "unknown",
        platform: "android" as const,
        storeName: "Google Play Store"
      };
    } else if (isAppStore) {
      const match = url.match(/id(\d+)/);
      return {
        appId: match?.[1] || "unknown",
        platform: "ios" as const,
        storeName: "Apple App Store"
      };
    }
    
    return null;
  };

  const simulateAppMetadata = (appId: string, platform: string, url: string): AppMetadata => {
    // Simulate realistic app metadata for analysis
    const sampleApps = {
      android: {
        "com.whatsapp": {
          name: "WhatsApp Messenger",
          developer: "WhatsApp LLC",
          rating: 4.2,
          reviewCount: 50000000,
          installCount: "5B+",
          permissions: ["CAMERA", "MICROPHONE", "CONTACTS", "LOCATION", "STORAGE"],
          contentRating: "Everyone",
          lastUpdated: "2024-01-15",
          description: "WhatsApp is a free messaging and video calling service"
        },
        "com.instagram.android": {
          name: "Instagram",
          developer: "Meta Platforms Inc",
          rating: 4.1,
          reviewCount: 45000000,
          installCount: "5B+",
          permissions: ["CAMERA", "MICROPHONE", "CONTACTS", "LOCATION", "STORAGE"],
          contentRating: "Teen",
          lastUpdated: "2024-01-10",
          description: "Instagram is a photo and video sharing social networking service"
        }
      },
      ios: {
        "310633997": {
          name: "WhatsApp Messenger",
          developer: "WhatsApp Inc.",
          rating: 4.5,
          reviewCount: 2500000,
          installCount: "1M+",
          permissions: ["Camera", "Microphone", "Contacts", "Location", "Photos"],
          contentRating: "4+",
          lastUpdated: "2024-01-15",
          description: "WhatsApp is a free messaging and video calling service"
        },
        "389801252": {
          name: "Instagram",
          developer: "Instagram, Inc.",
          rating: 4.3,
          reviewCount: 2200000,
          installCount: "1M+",
          permissions: ["Camera", "Microphone", "Contacts", "Location", "Photos"],
          contentRating: "12+",
          lastUpdated: "2024-01-10",
          description: "Instagram is a photo and video sharing social networking service"
        }
      }
    };

    const platformApps = platform === "android" ? sampleApps.android : sampleApps.ios;
    const appData = Object.values(platformApps)[0]; // Default to first app for demo

    return {
      appId,
      appName: appData.name,
      platform: platform as 'android' | 'ios',
      developerName: appData.developer,
      rating: appData.rating,
      reviewCount: appData.reviewCount,
      installCount: appData.installCount,
      permissions: appData.permissions,
      contentRating: appData.contentRating,
      lastUpdated: appData.lastUpdated,
      appStoreUrl: url,
      description: appData.description
    };
  };

  const generateSessionId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const handleAppSubmit = async (data: AppForm) => {
    try {
      setIsAnalyzing(true);
      setAnalysisProgress(0);
      setResult(null);

      const appInfo = extractAppInfo(data.appStoreUrl);
      if (!appInfo) {
        throw new Error("Invalid app store URL format");
      }

      // Simulate progress updates
      const progressSteps = [
        { step: 20, message: "Extracting app metadata..." },
        { step: 40, message: "Analyzing permissions..." },
        { step: 60, message: "Checking developer reputation..." },
        { step: 80, message: "Scanning for threats..." },
        { step: 100, message: "Analysis complete!" }
      ];

      for (const { step, message } of progressSteps) {
        setAnalysisProgress(step);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (step < 100) {
          toast({
            title: "Analyzing...",
            description: message,
          });
        }
      }

      // Generate app metadata for analysis
      const appMetadata = simulateAppMetadata(appInfo.appId, appInfo.platform, data.appStoreUrl);
      
      // Run analysis using existing mobile app analyzer
      const analysisResult = await mobileAppAnalyzer.analyzeApp(appMetadata);

      // Generate session ID for anonymous users
      const sessionId = user ? null : generateSessionId();

      // Store in database
      const { data: submission, error: submissionError } = await supabase
        .from("url_submissions")
        .insert({
          user_id: user?.id || null,
          session_id: sessionId,
          url: data.appStoreUrl,
          submission_type: "app",
          app_store_link: data.appStoreUrl,
          risk_score: analysisResult.riskScore,
          risk_level: analysisResult.riskLevel,
          threat_category: analysisResult.threatCategories[0] || "Unknown",
          primary_detection_reason: analysisResult.recommendations[0] || "App analysis completed",
          analysis_status: "completed",
          analysis_results: analysisResult as any,
          classification_confidence: 0.85,
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      // Store app metadata
      if (submission) {
        await supabase
          .from("app_metadata")
          .insert({
            submission_id: submission.id,
            app_id: appMetadata.appId,
            app_name: appMetadata.appName,
            platform: appMetadata.platform,
            developer_name: appMetadata.developerName,
            rating: appMetadata.rating,
            install_count: appMetadata.installCount,
            permissions: appMetadata.permissions,
            permission_risk_score: analysisResult.permissionAnalysis.permissionRiskScore,
          });
      }

      setResult(analysisResult);
      onAnalysisComplete?.(analysisResult);

      toast({
        title: "Analysis Complete",
        description: `App analyzed with ${analysisResult.riskLevel} risk level`,
      });

    } catch (error) {
      console.error("App analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze app",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case "low": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "medium": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "high": return <Shield className="h-4 w-4 text-red-600" />;
      default: return <Smartphone className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Mobile App Security Analysis
          </CardTitle>
          <CardDescription>
            Submit an app from Google Play Store or Apple App Store for comprehensive security analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAppSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="appStoreUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>App Store URL</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://play.google.com/store/apps/details?id=..."
                          {...field}
                          disabled={isAnalyzing}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(field.value, '_blank')}
                          disabled={!field.value || isAnalyzing}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional context about this app..."
                        className="resize-none"
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
                  <div className="flex justify-between text-sm">
                    <span>Analyzing app...</span>
                    <span>{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="w-full" />
                </div>
              )}

              <Button type="submit" disabled={isAnalyzing} className="w-full">
                {isAnalyzing ? "Analyzing..." : "Analyze App"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Analysis Results</span>
              <div className="flex items-center gap-2">
                {getRiskIcon(result.riskLevel)}
                <Badge variant={result.riskLevel === "low" ? "default" : result.riskLevel === "medium" ? "secondary" : "destructive"}>
                  {result.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{result.riskScore}/100</div>
                <div className="text-sm text-muted-foreground">Risk Score</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm text-muted-foreground">Confidence</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{result.threatCategories.length}</div>
                <div className="text-sm text-muted-foreground">Threat Categories</div>
              </div>
            </div>

            {result.threatCategories.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Threat Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {result.threatCategories.map((category, index) => (
                    <Badge key={index} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2">Permission Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Suspicious Permissions:</span>
                  <span className="font-medium">{result.permissionAnalysis.suspiciousPermissions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Risk Score:</span>
                  <span className={`font-medium ${getRiskColor(result.riskLevel)}`}>
                    {result.permissionAnalysis.permissionRiskScore}/100
                  </span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {result.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}