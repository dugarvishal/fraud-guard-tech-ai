import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, Eye, FileText } from 'lucide-react';

interface ThreatCategoryDetails {
  category: string;
  count: number;
  submissions: Array<{
    url: string;
    risk_score: number;
    created_at: string;
    primary_detection_reason: string;
  }>;
}

interface ThreatCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryDetails: ThreatCategoryDetails | null;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'phishing domain':
      return <Shield className="h-5 w-5" />;
    case 'fake website':
      return <Eye className="h-5 w-5" />;
    case 'scam mobile app':
      return <FileText className="h-5 w-5" />;
    default:
      return <AlertTriangle className="h-5 w-5" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'phishing domain':
      return 'destructive';
    case 'fake website':
      return 'destructive';
    case 'scam mobile app':
      return 'destructive';
    case 'malware-laden':
      return 'destructive';
    case 'ui similarity':
      return 'secondary';
    case 'suspicious language':
      return 'secondary';
    case 'safe content':
      return 'default';
    default:
      return 'destructive';
  }
};

export const ThreatCategoryModal: React.FC<ThreatCategoryModalProps> = ({
  isOpen,
  onClose,
  categoryDetails,
}) => {
  if (!categoryDetails) return null;

  const avgRiskScore = categoryDetails.submissions.length > 0
    ? categoryDetails.submissions.reduce((sum, sub) => sum + (sub.risk_score || 0), 0) / categoryDetails.submissions.length
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getCategoryIcon(categoryDetails.category)}
            {categoryDetails.category} Analysis
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Detections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categoryDetails.count}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgRiskScore.toFixed(1)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Threat Level</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={getCategoryColor(categoryDetails.category)}>
                  {avgRiskScore >= 80 ? 'Critical' : avgRiskScore >= 60 ? 'High' : avgRiskScore >= 40 ? 'Medium' : 'Low'}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Recent Detections */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Detections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryDetails.submissions.slice(0, 5).map((submission, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{submission.url}</p>
                      <p className="text-sm text-muted-foreground">
                        {submission.primary_detection_reason || 'Pattern-based detection'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant={submission.risk_score >= 80 ? 'destructive' : submission.risk_score >= 60 ? 'destructive' : 'secondary'}>
                        Risk: {submission.risk_score}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Threat Description */}
          <Card>
            <CardHeader>
              <CardTitle>Threat Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {getCategoryDescription(categoryDetails.category)}
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const getCategoryDescription = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'phishing domain':
      return 'Domains designed to steal user credentials by impersonating legitimate websites. These sites often mimic login pages of popular services to harvest usernames and passwords.';
    case 'fake website':
      return 'Websites that impersonate legitimate brands or services, often using similar domain names with character substitutions to deceive users.';
    case 'scam mobile app':
      return 'Mobile applications that contain malicious functionality, steal user data, or attempt to defraud users through fake promises or services.';
    case 'malware-laden':
      return 'Websites or applications that contain malicious software designed to harm devices, steal data, or gain unauthorized access to systems.';
    case 'ui similarity':
      return 'Content that visually mimics legitimate websites or applications to deceive users into thinking they are interacting with trusted services.';
    case 'suspicious language':
      return 'Content containing language patterns commonly associated with scams, such as urgent calls to action, fake rewards, or pressure tactics.';
    case 'safe content':
      return 'Content that has been analyzed and determined to pose no significant security risks to users.';
    default:
      return 'This threat category requires further analysis to determine the specific risk factors and potential impact.';
  }
};