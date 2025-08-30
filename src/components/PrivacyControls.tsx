import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Download, Trash2, Shield, Database, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const PrivacyControls = () => {
  const { user } = useAuth();
  const [deletionReason, setDeletionReason] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const handleDataExport = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to export your data.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      // Fetch user's data from various tables
      const [submissions, feedback, alerts, progress] = await Promise.all([
        supabase.from('url_submissions').select('*').eq('user_id', user.id),
        supabase.from('feedback').select('*').eq('user_id', user.id),
        supabase.from('real_time_alerts').select('*').eq('user_id', user.id),
        supabase.from('user_educational_progress').select('*').eq('user_id', user.id)
      ]);

      const userData = {
        profile: {
          email: user.email,
          created_at: user.created_at,
        },
        submissions: submissions.data || [],
        feedback: feedback.data || [],
        alerts: alerts.data || [],
        educational_progress: progress.data || [],
        exported_at: new Date().toISOString(),
      };

      // Create and download JSON file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `fraudguard-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "Your data has been successfully exported and downloaded.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeletionRequest = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request data deletion.",
        variant: "destructive",
      });
      return;
    }

    if (!deletionReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for the deletion request.",
        variant: "destructive",
      });
      return;
    }

    setIsRequesting(true);
    try {
      const { error } = await supabase
        .from('data_deletion_requests')
        .insert({
          user_id: user.id,
          email: user.email || '',
          request_reason: deletionReason,
        });

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: "Your data deletion request has been submitted and will be processed within 30 days.",
      });
      
      setDeletionReason("");
    } catch (error) {
      console.error('Deletion request error:', error);
      toast({
        title: "Request Failed",
        description: "Failed to submit deletion request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const dataTypes = [
    {
      name: "Profile Information",
      icon: Shield,
      description: "Email address, display name, account settings",
      retention: "Until account deletion"
    },
    {
      name: "Submission History",
      icon: Database,
      description: "URLs submitted for analysis, results, and timestamps",
      retention: "2 years or until deletion"
    },
    {
      name: "Usage Analytics",
      icon: Eye,
      description: "Page views, feature usage, performance metrics",
      retention: "1 year (anonymized after 90 days)"
    },
    {
      name: "Security Alerts",
      icon: AlertTriangle,
      description: "Real-time threat notifications and alert history",
      retention: "1 year or until deletion"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Data Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Your Data Overview
          </CardTitle>
          <CardDescription>
            Types of data we collect and how long we retain them
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {dataTypes.map((type, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <type.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{type.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{type.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      Retention: {type.retention}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export Your Data
          </CardTitle>
          <CardDescription>
            Download a complete copy of your personal data in JSON format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2">What's included:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Profile information and account settings</li>
              <li>• Complete submission history and analysis results</li>
              <li>• Feedback and educational progress</li>
              <li>• Security alerts and notification history</li>
            </ul>
          </div>
          <Button 
            onClick={handleDataExport}
            disabled={isExporting || !user}
            className="w-full"
          >
            {isExporting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Exporting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export My Data
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Data Deletion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Request Data Deletion
          </CardTitle>
          <CardDescription>
            Request permanent deletion of your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-destructive mb-1">Important Notice</p>
                <p className="text-xs text-muted-foreground">
                  This action cannot be undone. All your data, including submissions, 
                  analysis history, and account information will be permanently deleted 
                  within 30 days.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deletion-reason">Reason for deletion (required)</Label>
            <Textarea
              id="deletion-reason"
              value={deletionReason}
              onChange={(e) => setDeletionReason(e.target.value)}
              placeholder="Please provide a reason for requesting data deletion..."
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleDeletionRequest}
            disabled={isRequesting || !user || !deletionReason.trim()}
            variant="destructive"
            className="w-full"
          >
            {isRequesting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Submitting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Request Data Deletion
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Rights */}
      <Card>
        <CardHeader>
          <CardTitle>Your Privacy Rights</CardTitle>
          <CardDescription>
            Rights you have regarding your personal data under GDPR and other privacy laws
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Access Rights</h4>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• View all data we have about you</li>
                <li>• Export your data in a readable format</li>
                <li>• Understand how your data is processed</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Control Rights</h4>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• Correct inaccurate information</li>
                <li>• Delete your account and data</li>
                <li>• Restrict certain data processing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyControls;