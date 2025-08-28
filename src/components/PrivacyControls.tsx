import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Shield, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

const PrivacyControls = () => {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDataDeletionRequest = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('data_deletion_requests')
        .insert({
          user_id: user.id,
          email: user.email || '',
          request_reason: reason.trim() || null
        });

      if (error) throw error;

      toast.success("Data deletion request submitted successfully. We'll process it within 30 days.");
      setReason("");
    } catch (error) {
      console.error('Error submitting deletion request:', error);
      toast.error("Failed to submit deletion request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportUserData = async () => {
    if (!user) return;

    try {
      // Fetch all user data
      const [submissions, feedback, alerts] = await Promise.all([
        supabase.from('url_submissions').select('*').eq('user_id', user.id),
        supabase.from('feedback').select('*').eq('user_id', user.id),
        supabase.from('real_time_alerts').select('*').eq('user_id', user.id)
      ]);

      const userData = {
        user_profile: { id: user.id, email: user.email },
        url_submissions: submissions.data || [],
        feedback: feedback.data || [],
        real_time_alerts: alerts.data || [],
        exported_at: new Date().toISOString()
      };

      // Create and download JSON file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `user-data-${user.id}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success("User data exported successfully");
    } catch (error) {
      console.error('Error exporting user data:', error);
      toast.error("Failed to export user data");
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Controls
          </CardTitle>
          <CardDescription>
            Sign in to access privacy controls and data management options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a href="/auth">Sign In</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Controls
          </CardTitle>
          <CardDescription>
            Manage your data and privacy preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Export Your Data</h3>
              <p className="text-sm text-muted-foreground">
                Download a copy of all your data stored on our platform
              </p>
            </div>
            <Button variant="outline" onClick={exportUserData}>
              Export Data
            </Button>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-destructive">Delete Your Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Request permanent deletion of all your personal data. This action cannot be undone.
                </p>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="deletion-reason">Reason for deletion (optional)</Label>
                    <Textarea
                      id="deletion-reason"
                      placeholder="Help us understand why you're leaving..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Request Data Deletion
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all your data including:
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>All URL analysis history</li>
                            <li>Saved reports and results</li>
                            <li>Account preferences</li>
                            <li>Feedback and support history</li>
                          </ul>
                          <br />
                          This action cannot be undone and you will lose access to your account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDataDeletionRequest}
                          disabled={loading}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          {loading ? "Submitting..." : "Delete My Data"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Processing Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-medium text-foreground mb-2">What data do we collect?</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>URLs you submit for analysis</li>
              <li>Analysis results and reports</li>
              <li>Usage patterns and preferences</li>
              <li>Feedback and support interactions</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2">How do we use your data?</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide security analysis services</li>
              <li>Improve our AI models and detection capabilities</li>
              <li>Provide customer support</li>
              <li>Send important security notifications</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2">Data retention</h4>
            <p>
              We retain your data for as long as your account is active. You can request deletion at any time,
              and we will process your request within 30 days as required by privacy regulations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyControls;