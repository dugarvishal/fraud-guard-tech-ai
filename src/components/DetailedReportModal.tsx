import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, ExternalLink, Shield, AlertTriangle, Calendar, Globe } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DetailedReportData {
  id: string;
  url: string;
  threat_category: string;
  risk_score: number;
  risk_level: string;
  created_at: string;
  primary_detection_reason: string;
  classification_confidence: number;
  analysis_results: any;
  supporting_evidence: any;
}

interface DetailedReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: DetailedReportData | null;
}

export const DetailedReportModal: React.FC<DetailedReportModalProps> = ({
  isOpen,
  onClose,
  reportData,
}) => {
  const generatePDF = async () => {
    if (!reportData) return;

    const element = document.getElementById('detailed-report-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `threat-analysis-${reportData.url.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (!reportData) return null;

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Detailed Threat Analysis Report
            </DialogTitle>
            <Button onClick={generatePDF} size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </DialogHeader>

        <div id="detailed-report-content" className="space-y-6 p-4 bg-background">
          {/* Header Section */}
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold">Security Analysis Report</h1>
            <p className="text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
          </div>

          {/* URL and Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Target Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">URL</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 p-2 bg-muted rounded text-sm break-all">
                      {reportData.url}
                    </code>
                    <Button size="sm" variant="outline" asChild>
                      <a href={reportData.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Analysis Date</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(reportData.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{reportData.risk_score}/100</div>
                  <Badge variant={getRiskBadgeVariant(reportData.risk_level)} className="mb-2">
                    {reportData.risk_level || 'Unknown'} Risk
                  </Badge>
                  <p className="text-sm text-muted-foreground">Overall Risk Score</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{Math.round((reportData.classification_confidence || 0) * 100)}%</div>
                  <Badge variant="outline" className="mb-2">Confidence</Badge>
                  <p className="text-sm text-muted-foreground">Classification Accuracy</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold mb-2 break-words">{reportData.threat_category || 'Unknown'}</div>
                  <Badge variant="secondary" className="mb-2">Threat Category</Badge>
                  <p className="text-sm text-muted-foreground">Primary Classification</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detection Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detection Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Primary Detection Reason</label>
                <p className="mt-1 p-3 bg-muted rounded-lg">
                  {reportData.primary_detection_reason || 'Automated pattern analysis detected suspicious characteristics'}
                </p>
              </div>
              
              {reportData.supporting_evidence && Object.keys(reportData.supporting_evidence).length > 0 && (
                <div>
                  <label className="text-sm font-medium">Supporting Evidence</label>
                  <div className="mt-2 space-y-2">
                    {Object.entries(reportData.supporting_evidence).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="text-sm">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {reportData.analysis_results && (
            <Card>
              <CardHeader>
                <CardTitle>Technical Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(reportData.analysis_results, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Security Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getRecommendations(reportData.threat_category, reportData.risk_score).map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <Separator />
          <div className="text-center text-sm text-muted-foreground">
            <p>This report was generated by AI-powered threat analysis.</p>
            <p>Report ID: {reportData.id}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const getRecommendations = (threatCategory: string, riskScore: number): string[] => {
  const baseRecommendations = [
    "Do not enter personal information on suspicious websites",
    "Verify website authenticity through official channels",
    "Use strong, unique passwords for all accounts",
    "Enable two-factor authentication where possible",
  ];

  const categorySpecific: Record<string, string[]> = {
    'phishing domain': [
      "Never enter login credentials on suspicious domains",
      "Check for HTTPS and valid SSL certificates",
      "Verify domain spelling and legitimate extensions",
      "Report phishing attempts to relevant authorities"
    ],
    'fake website': [
      "Compare with official website design and content",
      "Check domain registration details and age",
      "Avoid making purchases on unverified sites",
      "Use official app stores for software downloads"
    ],
    'scam mobile app': [
      "Only download apps from official app stores",
      "Read reviews and check developer reputation",
      "Review app permissions before installation",
      "Avoid apps requesting excessive permissions"
    ]
  };

  const specific = categorySpecific[threatCategory?.toLowerCase()] || [];
  
  if (riskScore >= 80) {
    return [
      "IMMEDIATE ACTION REQUIRED: Do not interact with this content",
      "Block this domain in your security software",
      ...specific,
      ...baseRecommendations
    ];
  } else if (riskScore >= 60) {
    return [
      "Exercise extreme caution when interacting with this content",
      ...specific,
      ...baseRecommendations
    ];
  } else {
    return [
      "Monitor for suspicious behavior",
      ...specific.slice(0, 2),
      ...baseRecommendations.slice(0, 2)
    ];
  }
};