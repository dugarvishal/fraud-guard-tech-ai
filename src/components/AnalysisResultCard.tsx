import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  CheckCircle, AlertTriangle, Clock, Shield, Eye, Download, 
  Share2, ChevronDown, Globe, Lock, Server, Zap,
  ExternalLink, Calendar, Target, TrendingUp, AlertCircle
} from 'lucide-react';

interface AnalysisResult {
  id: string;
  url: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'completed' | 'processing' | 'failed';
  analysisResults: {
    domainAge: number;
    sslStatus: string;
    redirectCount: number;
    maliciousContent: boolean;
    phishingKeywords: number;
    riskFactors: string[];
    scanTimestamp: string;
    technicalDetails?: {
      serverLocation: string;
      responseTime: number;
      contentType: string;
      certExpiry: string;
    };
    mlAnalysis?: {
      confidenceScore: number;
      threatCategories: string[];
      suspiciousPatterns: { pattern: string; severity: string }[];
    };
  };
}

interface AnalysisResultCardProps {
  result: AnalysisResult;
  showDetailed?: boolean;
  onShare?: (result: AnalysisResult) => void;
  onDownload?: (result: AnalysisResult) => void;
}

const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({ 
  result, 
  showDetailed = true,
  onShare,
  onDownload 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'hsl(var(--primary))';
      case 'medium': return 'hsl(var(--security-secondary))';
      case 'high': return 'hsl(var(--destructive))';
      case 'critical': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return CheckCircle;
      case 'medium': return Clock;
      case 'high': return AlertTriangle;
      case 'critical': return AlertCircle;
      default: return Clock;
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    return level === 'low' ? 'default' : 'destructive';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'text-primary';
      case 'medium': return 'text-security-secondary';
      case 'high': return 'text-destructive';
      case 'critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getProgressColor = (score: number) => {
    if (score <= 30) return 'hsl(var(--primary))';
    if (score <= 60) return 'hsl(var(--security-secondary))';
    return 'hsl(var(--destructive))';
  };

  const RiskIcon = getRiskIcon(result.riskLevel);

  return (
    <Card className="transition-all duration-300 hover:shadow-feature">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div 
              className="p-2 rounded-full bg-opacity-10"
              style={{ backgroundColor: getRiskColor(result.riskLevel) + '20' }}
            >
              <RiskIcon 
                className="h-5 w-5" 
                style={{ color: getRiskColor(result.riskLevel) }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg truncate flex items-center gap-2">
                <span className="truncate">{new URL(result.url).hostname}</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </CardTitle>
              <CardDescription className="truncate">{result.url}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge 
              variant={getRiskBadgeVariant(result.riskLevel)}
              className={
                result.riskLevel === 'low' 
                  ? 'bg-primary/10 text-primary border-primary/20' 
                  : ''
              }
            >
              {result.riskLevel.toUpperCase()} RISK
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Risk Score with Enhanced Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Risk Score</span>
            <div className="flex items-center gap-2">
              <span 
                className="text-lg font-bold"
                style={{ color: getRiskColor(result.riskLevel) }}
              >
                {result.riskScore}/100
              </span>
              {result.analysisResults.mlAnalysis && (
                <Badge variant="outline" className="text-xs">
                  AI: {result.analysisResults.mlAnalysis.confidenceScore}%
                </Badge>
              )}
            </div>
          </div>
          <div className="relative">
            <Progress 
              value={result.riskScore} 
              className="h-3"
              style={{
                background: `linear-gradient(to right, ${getProgressColor(result.riskScore)} 0%, ${getProgressColor(result.riskScore)}40 100%)`
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-background mix-blend-difference">
                {result.riskScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Domain Age</span>
            </div>
            <p className="font-medium">{result.analysisResults.domainAge} days</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>SSL Status</span>
            </div>
            <p className={`font-medium ${
              result.analysisResults.sslStatus === 'valid' 
                ? 'text-primary' 
                : 'text-destructive'
            }`}>
              {result.analysisResults.sslStatus}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Redirects</span>
            </div>
            <p className="font-medium">{result.analysisResults.redirectCount}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Target className="h-3 w-3" />
              <span>Phishing</span>
            </div>
            <p className={`font-medium ${
              result.analysisResults.phishingKeywords > 0 
                ? 'text-destructive' 
                : 'text-primary'
            }`}>
              {result.analysisResults.phishingKeywords} keywords
            </p>
          </div>
        </div>

        {/* Risk Factors */}
        {result.analysisResults.riskFactors.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Risk Factors:</span>
            <div className="flex flex-wrap gap-1">
              {result.analysisResults.riskFactors.slice(0, 3).map((factor, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {factor}
                </Badge>
              ))}
              {result.analysisResults.riskFactors.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{result.analysisResults.riskFactors.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            Scanned {formatDate(result.analysisResults.scanTimestamp)}
          </div>
          <div className="flex items-center gap-2">
            {showDetailed && (
              <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                    <ChevronDown 
                      className={`h-4 w-4 ml-1 transform transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`} 
                    />
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            )}
            {onShare && (
              <Button variant="ghost" size="sm" onClick={() => onShare(result)}>
                <Share2 className="h-4 w-4" />
              </Button>
            )}
            {onDownload && (
              <Button variant="ghost" size="sm" onClick={() => onDownload(result)}>
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Detailed Analysis - Collapsible */}
        {showDetailed && (
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleContent className="space-y-4 pt-4 border-t">
              <Accordion type="single" collapsible className="w-full">
                {/* Technical Details */}
                <AccordionItem value="technical">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      Technical Analysis
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Server Location:</span>
                        <p className="font-medium">
                          {result.analysisResults.technicalDetails?.serverLocation || 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Response Time:</span>
                        <p className="font-medium">
                          {result.analysisResults.technicalDetails?.responseTime || 'N/A'}ms
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Content Type:</span>
                        <p className="font-medium">
                          {result.analysisResults.technicalDetails?.contentType || 'text/html'}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cert Expiry:</span>
                        <p className="font-medium">
                          {result.analysisResults.technicalDetails?.certExpiry || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* ML Analysis */}
                {result.analysisResults.mlAnalysis && (
                  <AccordionItem value="ml-analysis">
                    <AccordionTrigger className="text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-security-ai" />
                        AI/ML Analysis
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">AI Confidence</span>
                          <span className="text-sm text-security-ai">
                            {result.analysisResults.mlAnalysis.confidenceScore}%
                          </span>
                        </div>
                        <Progress 
                          value={result.analysisResults.mlAnalysis.confidenceScore} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Threat Categories:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {result.analysisResults.mlAnalysis.threatCategories.map((category, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Suspicious Patterns:</span>
                        <div className="space-y-1 mt-1">
                          {result.analysisResults.mlAnalysis.suspiciousPatterns.map((pattern, index) => (
                            <div key={index} className="flex items-center justify-between text-xs">
                              <span>{pattern.pattern}</span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getSeverityColor(pattern.severity)}`}
                              >
                                {pattern.severity}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* All Risk Factors */}
                <AccordionItem value="risk-factors">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      All Risk Factors ({result.analysisResults.riskFactors.length})
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {result.analysisResults.riskFactors.map((factor, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="h-3 w-3 text-destructive flex-shrink-0" />
                          <span>{factor}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisResultCard;