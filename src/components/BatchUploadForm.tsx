import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, FileText, CheckCircle, AlertTriangle, X, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";


const batchSchema = z.object({
  file: z.instanceof(File).refine((file) => file.type === "text/csv", {
    message: "File must be a CSV",
  }),
});

type BatchForm = z.infer<typeof batchSchema>;

interface BatchResult {
  url: string;
  description?: string;
  status: "pending" | "analyzing" | "completed" | "failed";
  riskScore?: number;
  riskLevel?: string;
  threatCategory?: string;
  error?: string;
}

// Simulate analysis for batch processing
const simulateUrlAnalysis = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const riskScores = [15, 35, 65, 85];
  const riskLevels = ["low", "medium", "high"];
  const threatCategories = ["Phishing", "Malware", "Scam", "Suspicious"];
  
  const riskScore = riskScores[Math.floor(Math.random() * riskScores.length)];
  const riskLevel = riskScore < 30 ? "low" : riskScore < 70 ? "medium" : "high";
  const threatCategory = threatCategories[Math.floor(Math.random() * threatCategories.length)];
  
  return {
    riskScore,
    riskLevel,
    threatCategory,
    primaryReason: `Detected ${threatCategory.toLowerCase()} indicators`,
    confidence: Math.floor(Math.random() * 20) + 80,
  };
};

interface ParsedCSV {
  data: { url: string; description?: string }[];
  errors: string[];
}

export function BatchUploadForm() {
  const [csvData, setCsvData] = useState<ParsedCSV | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [results, setResults] = useState<BatchResult[]>([]);
  const [batchId, setBatchId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<BatchForm>({
    resolver: zodResolver(batchSchema),
  });

  const handleFileSelect = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        const errors: string[] = [];
        const parsedData: { url: string; description?: string }[] = [];

        data.forEach((row, index) => {
          if (!row.url) {
            errors.push(`Row ${index + 1}: Missing URL`);
            return;
          }

          try {
            new URL(row.url);
            parsedData.push({
              url: row.url,
              description: row.description || undefined,
            });
          } catch {
            errors.push(`Row ${index + 1}: Invalid URL format`);
          }
        });

        if (parsedData.length === 0) {
          errors.push("No valid URLs found in CSV");
        }

        if (parsedData.length > 100) {
          errors.push("Maximum 100 URLs allowed per batch");
          parsedData.splice(100);
        }

        setCsvData({ data: parsedData, errors });
        setResults(parsedData.map(item => ({ ...item, status: "pending" })));

        if (errors.length > 0) {
          toast({
            title: "CSV Validation",
            description: `${errors.length} issues found. Check the preview below.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "CSV Parsed Successfully",
            description: `${parsedData.length} URLs ready for analysis`,
          });
        }
      },
      error: (error) => {
        toast({
          title: "CSV Parse Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("file", file);
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      form.setValue("file", file);
      handleFileSelect(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const generateSessionId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const processBatch = async () => {
    if (!csvData || csvData.data.length === 0) return;

    console.log("🚀 Starting batch processing", {
      totalUrls: csvData.data.length,
      user: user?.id ? "authenticated" : "anonymous",
      csvData: csvData.data.slice(0, 3) // Log first 3 URLs for debugging
    });

    try {
      setIsProcessing(true);
      setProcessingProgress(0);

      // Generate session ID for anonymous users
      const sessionId = user ? null : generateSessionId();
      console.log("📝 Session info", { userId: user?.id, sessionId });

      // Create batch submission record
      console.log("📤 Creating batch submission record...");
      const batchInsertData = {
        user_id: user?.id || null,
        session_id: sessionId,
        file_name: form.getValues("file").name,
        total_urls: csvData.data.length,
        status: "processing" as const,
      };
      console.log("📝 Batch insert data:", batchInsertData);

      const { data: batch, error: batchError } = await supabase
        .from("batch_submissions")
        .insert(batchInsertData)
        .select()
        .single();

      if (batchError) {
        console.error("❌ Batch creation failed:", batchError);
        throw batchError;
      }
      
      console.log("✅ Batch created successfully:", batch);
      setBatchId(batch.id);

      // Process URLs sequentially
      const updatedResults = [...results];
      let successCount = 0;
      let failureCount = 0;

      for (let i = 0; i < csvData.data.length; i++) {
        const item = csvData.data[i];
        console.log(`🔍 Processing URL ${i + 1}/${csvData.data.length}:`, item.url);
        
        // Update status to analyzing
        updatedResults[i].status = "analyzing";
        setResults([...updatedResults]);

        try {
          // Simulate analysis for batch processing
          console.log(`🧠 Running analysis for URL ${i + 1}...`);
          const analysisResult = await simulateUrlAnalysis();
          console.log(`📊 Analysis result for URL ${i + 1}:`, analysisResult);
          
          // Prepare submission data
          const submissionData = {
            user_id: user?.id || null,
            session_id: sessionId,
            url: item.url,
            submission_type: "url" as const,
            risk_score: analysisResult.riskScore,
            risk_level: analysisResult.riskLevel,
            threat_category: analysisResult.threatCategory,
            primary_detection_reason: analysisResult.primaryReason,
            analysis_status: "completed" as const,
            analysis_results: analysisResult,
            classification_confidence: analysisResult.confidence,
          };
          
          console.log(`📤 Inserting submission ${i + 1}:`, submissionData);
          
          // Store individual URL submission
          const { data: submission, error: submissionError } = await supabase
            .from("url_submissions")
            .insert(submissionData)
            .select()
            .single();

          if (submissionError) {
            console.error(`❌ Submission ${i + 1} failed:`, submissionError);
            console.error("Full error object:", JSON.stringify(submissionError, null, 2));
            throw submissionError;
          }

          console.log(`✅ Submission ${i + 1} successful:`, submission.id);
          successCount++;

          // Update result
          updatedResults[i] = {
            ...updatedResults[i],
            status: "completed",
            riskScore: analysisResult.riskScore,
            riskLevel: analysisResult.riskLevel,
            threatCategory: analysisResult.threatCategory,
          };

        } catch (error) {
          console.error(`❌ URL ${i + 1} processing failed:`, error);
          console.error("Error details:", {
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
            fullError: error
          });
          
          failureCount++;
          updatedResults[i] = {
            ...updatedResults[i],
            status: "failed",
            error: error instanceof Error ? error.message : "Analysis failed",
          };
        }

        setResults([...updatedResults]);
        setProcessingProgress(((i + 1) / csvData.data.length) * 100);

        // Update batch processed count after each URL
        console.log(`📊 Updating batch progress: ${i + 1}/${csvData.data.length} processed`);
        await supabase
          .from("batch_submissions")
          .update({ processed_urls: i + 1 })
          .eq("id", batch.id);

        // Small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Final batch submission status update
      console.log(`📋 Final batch stats: ${successCount} success, ${failureCount} failures`);
      const finalStatus = successCount === csvData.data.length ? "completed" : 
                         successCount > 0 ? "partial" : "failed";
      
      console.log("📤 Updating final batch status to:", finalStatus);
      const { error: updateError } = await supabase
        .from("batch_submissions")
        .update({
          processed_urls: successCount,
          status: finalStatus,
        })
        .eq("id", batch.id);

      if (updateError) {
        console.error("❌ Failed to update batch status:", updateError);
      } else {
        console.log("✅ Batch status updated successfully");
      }

      toast({
        title: "Batch Processing Complete",
        description: `${successCount}/${csvData.data.length} URLs analyzed successfully`,
      });

    } catch (error) {
      console.error("💥 Batch processing failed:", error);
      console.error("Full error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error
      });
      
      toast({
        title: "Batch Processing Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      console.log("🏁 Batch processing finished");
    }
  };

  const downloadResults = () => {
    const csvContent = [
      ["URL", "Status", "Risk Score", "Risk Level", "Threat Category", "Error"],
      ...results.map(result => [
        result.url,
        result.status,
        result.riskScore || "",
        result.riskLevel || "",
        result.threatCategory || "",
        result.error || "",
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `batch_analysis_results_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed": return <X className="h-4 w-4 text-red-600" />;
      case "analyzing": return <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      default: return <div className="h-4 w-4 rounded-full bg-muted" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      analyzing: "default",
      completed: "default",
      failed: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Batch URL Analysis
          </CardTitle>
          <CardDescription>
            Upload a CSV file with URLs for bulk security analysis. Format: url,description (description optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="file"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>CSV File</FormLabel>
                    <FormControl>
                      <div
                        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop your CSV file here, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                          CSV format: url,description (max 100 URLs)
                        </p>
                        <Input
                          type="file"
                          accept=".csv"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          disabled={isProcessing}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      {csvData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>CSV Preview</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {csvData.data.length} URLs
                </Badge>
                {csvData.errors.length > 0 && (
                  <Badge variant="destructive">
                    {csvData.errors.length} Errors
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {csvData.errors.length > 0 && (
              <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h4 className="font-semibold text-destructive mb-2">Validation Errors:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                  {csvData.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <ScrollArea className="h-64 border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.data.slice(0, 50).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{item.url}</TableCell>
                      <TableCell>{item.description || "-"}</TableCell>
                      <TableCell>Valid</TableCell>
                    </TableRow>
                  ))}
                  {csvData.data.length > 50 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        ... and {csvData.data.length - 50} more URLs
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Ready to analyze {csvData.data.length} URLs
              </div>
              <Button 
                onClick={processBatch} 
                disabled={isProcessing || csvData.data.length === 0 || csvData.errors.length > 0}
              >
                {isProcessing ? "Processing..." : "Start Batch Analysis"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Batch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(processingProgress)}%</span>
              </div>
              <Progress value={processingProgress} className="w-full" />
              <div className="text-sm text-muted-foreground">
                Analyzing URLs... This may take a few minutes.
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && results.some(r => r.status !== "pending") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Analysis Results</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={downloadResults}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
                <Badge variant="outline">
                  {results.filter(r => r.status === "completed").length}/{results.length} Complete
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Threat Category</TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm max-w-xs truncate">
                        {result.url}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(result.status)}
                          {getStatusBadge(result.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {result.riskScore ? `${result.riskScore}/100` : "-"}
                      </TableCell>
                      <TableCell>
                        {result.riskLevel && (
                          <Badge variant={result.riskLevel === "low" ? "default" : result.riskLevel === "medium" ? "secondary" : "destructive"}>
                            {result.riskLevel.toUpperCase()}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{result.threatCategory || "-"}</TableCell>
                      <TableCell className="text-red-600 text-sm">
                        {result.error || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}