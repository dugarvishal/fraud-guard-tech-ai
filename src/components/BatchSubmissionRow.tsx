import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, FileText, Download } from 'lucide-react';

interface BatchSubmissionRowProps {
  batch: any;
  submissions: any[];
  onRowClick: (submission: any) => void;
}

export function BatchSubmissionRow({ batch, submissions, onRowClick }: BatchSubmissionRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'processing': return 'secondary';
      case 'partial': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'default';
      case 'medium': return 'secondary';  
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const calculateBatchStats = () => {
    const totalUrls = batch.total_urls || 0;
    const processedUrls = batch.processed_urls || 0;
    const highRiskCount = submissions.filter(s => s.risk_level === 'high' || s.risk_level === 'critical').length;
    const avgRisk = submissions.length > 0 
      ? Math.round(submissions.reduce((sum, s) => sum + (s.risk_score || 0), 0) / submissions.length)
      : 0;

    return { totalUrls, processedUrls, highRiskCount, avgRisk };
  };

  const stats = calculateBatchStats();

  return (
    <>
      <TableRow className="cursor-pointer hover:bg-muted/50">
        <TableCell colSpan={7}>
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between w-full p-2">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Batch: {batch.file_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(batch.created_at).toLocaleDateString()} • {stats.processedUrls}/{stats.totalUrls} processed
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {stats.avgRisk > 0 && `${stats.avgRisk}/100 avg risk`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stats.highRiskCount > 0 && `${stats.highRiskCount} high risk`}
                    </div>
                  </div>
                  <Badge variant={getStatusColor(batch.status)}>
                    {batch.status?.toUpperCase() || 'UNKNOWN'}
                  </Badge>
                </div>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="pt-4">
                <div className="mb-3 flex justify-between items-center">
                  <h4 className="font-medium text-sm">Batch URLs ({submissions.length})</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Export batch results
                      const csvContent = [
                        'URL,Risk Score,Risk Level,Threat Category,Analysis Date',
                        ...submissions.map(sub => 
                          `"${sub.url}",${sub.risk_score || 0},"${sub.risk_level || 'Unknown'}","${sub.threat_category || 'Unknown'}","${sub.created_at}"`
                        )
                      ].join('\n');
                      
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `batch_${batch.file_name.replace('.csv', '')}_results.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="py-2 text-xs">URL</TableHead>
                        <TableHead className="py-2 text-xs">Risk Score</TableHead>
                        <TableHead className="py-2 text-xs">Risk Level</TableHead>
                        <TableHead className="py-2 text-xs">Threat Category</TableHead>
                        <TableHead className="py-2 text-xs">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow 
                          key={submission.id} 
                          className="cursor-pointer hover:bg-muted/25"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRowClick(submission);
                          }}
                        >
                          <TableCell className="py-2 max-w-xs">
                            <div className="truncate text-xs font-mono">
                              {submission.url}
                            </div>
                          </TableCell>
                          <TableCell className="py-2">
                            <div className="text-xs font-medium">
                              {submission.risk_score || 0}/100
                            </div>
                          </TableCell>
                          <TableCell className="py-2">
                            {submission.risk_level && (
                              <Badge 
                                variant={getRiskBadgeVariant(submission.risk_level)}
                                className="text-xs py-0"
                              >
                                {submission.risk_level?.toUpperCase()}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="py-2">
                            <div className="text-xs">
                              {submission.threat_category || 'Unknown'}
                            </div>
                          </TableCell>
                          <TableCell className="py-2">
                            <div className="text-xs text-muted-foreground">
                              {new Date(submission.created_at).toLocaleDateString()}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </TableCell>
      </TableRow>
    </>
  );
}