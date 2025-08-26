import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Clock, CheckCircle, Download, Share2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface EducationalContent {
  id: string;
  title: string;
  content: any;
  content_type: string;
  difficulty_level: string;
  estimated_reading_time: number;
  tags: string[];
  category?: {
    name: string;
    color: string;
  };
}

interface EducationalArticleProps {
  content: EducationalContent;
  userProgress: number;
  onBack: () => void;
  onProgressUpdate: () => void;
}

const EducationalArticle = ({ content, userProgress, onBack, onProgressUpdate }: EducationalArticleProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [checklistProgress, setChecklistProgress] = useState<{ [key: number]: boolean }>({});
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(userProgress);

  useEffect(() => {
    // Mark article as started when opened
    if (user && currentProgress === 0) {
      updateUserProgress(25, "in_progress");
    }
  }, [user]);

  const updateUserProgress = async (progressPercentage: number, status: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("user_educational_progress")
      .upsert({
        user_id: user.id,
        content_id: content.id,
        progress_percentage: progressPercentage,
        status: status,
        completed_at: status === "completed" ? new Date().toISOString() : null,
      });

    if (error) {
      console.error("Error updating progress:", error);
      return;
    }

    setCurrentProgress(progressPercentage);
    onProgressUpdate();

    if (status === "completed") {
      toast({
        title: "Congratulations!",
        description: `You've completed "${content.title}"`,
      });
    }
  };

  const handleChecklistChange = (index: number, checked: boolean) => {
    const newProgress = { ...checklistProgress, [index]: checked };
    setChecklistProgress(newProgress);

    // Calculate progress based on checklist completion
    const completedItems = Object.values(newProgress).filter(Boolean).length;
    const totalItems = content.content.checklist?.length || 0;
    const progressPercentage = Math.round((completedItems / totalItems) * 100);
    
    if (user) {
      updateUserProgress(
        Math.max(progressPercentage, 50), // Minimum 50% for reading
        progressPercentage === 100 ? "completed" : "in_progress"
      );
    }
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    
    if (!content.content.quiz) return;

    // Calculate quiz score
    const correctAnswers = content.content.quiz.filter(
      (question: any, index: number) => quizAnswers[index] === question.correct
    ).length;
    
    const score = (correctAnswers / content.content.quiz.length) * 100;
    
    if (user) {
      updateUserProgress(
        100, // Quiz completion means 100%
        score >= 70 ? "completed" : "in_progress"
      );
    }

    toast({
      title: "Quiz Completed!",
      description: `You scored ${Math.round(score)}% (${correctAnswers}/${content.content.quiz.length} correct)`,
    });
  };

  const handleMarkComplete = () => {
    if (user) {
      updateUserProgress(100, "completed");
    }
  };

  const handleDownloadPDF = () => {
    // Generate PDF content
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${content.title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              h1 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
              h2 { color: #555; margin-top: 30px; }
              .meta { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
              .checklist { margin: 20px 0; }
              .checklist-item { margin: 10px 0; padding: 5px; }
              @media print { body { margin: 20px; } }
            </style>
          </head>
          <body>
            <h1>${content.title}</h1>
            <div class="meta">
              <strong>Category:</strong> ${content.category?.name || 'General'}<br>
              <strong>Difficulty:</strong> ${content.difficulty_level}<br>
              <strong>Reading Time:</strong> ${content.estimated_reading_time} minutes<br>
              <strong>Tags:</strong> ${content.tags.join(', ')}
            </div>
            ${content.content.sections?.map((section: any) => `
              <h2>${section.title}</h2>
              <p>${section.content}</p>
            `).join('') || ''}
            ${content.content.checklist ? `
              <h2>Security Checklist</h2>
              <div class="checklist">
                ${content.content.checklist.map((item: any) => `
                  <div class="checklist-item">
                    ☐ <strong>${typeof item === 'string' ? item : item.item}</strong>
                    ${typeof item === 'object' && item.description ? `<br><em>${item.description}</em>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: `Check out this security guide: ${content.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Share link copied to clipboard",
      });
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-success text-success-foreground";
      case "intermediate": return "bg-secondary text-secondary-foreground";
      case "advanced": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Education
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold">{content.title}</h1>
            
            <div className="flex flex-wrap gap-3 items-center">
              <Badge className={getDifficultyColor(content.difficulty_level)}>
                {content.difficulty_level}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {content.estimated_reading_time} min read
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {content.content_type}
              </Badge>
              {content.category && (
                <Badge variant="outline">
                  {content.category.name}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="h-2 w-2 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {user && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Your Progress</span>
                    <span className="text-sm text-muted-foreground">{currentProgress}%</span>
                  </div>
                  <Progress value={currentProgress} className="h-2" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Content Sections */}
        {content.content.sections && (
          <div className="space-y-8 mb-8">
            {content.content.sections.map((section: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Interactive Checklist */}
        {content.content.checklist && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Security Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {content.content.checklist.map((item: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Checkbox
                      id={`checklist-${index}`}
                      checked={checklistProgress[index] || false}
                      onCheckedChange={(checked) => handleChecklistChange(index, checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex flex-col">
                      <Label
                        htmlFor={`checklist-${index}`}
                        className={`text-sm font-medium leading-relaxed cursor-pointer ${
                          checklistProgress[index] ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {typeof item === 'string' ? item : item.item}
                      </Label>
                      {typeof item === 'object' && item.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quiz */}
        {content.content.quiz && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Knowledge Check</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {content.content.quiz.map((question: any, index: number) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-medium">{question.question}</h4>
                    <RadioGroup
                      value={quizAnswers[index]?.toString()}
                      onValueChange={(value) => setQuizAnswers({ ...quizAnswers, [index]: parseInt(value) })}
                      disabled={quizSubmitted}
                    >
                      {question.options.map((option: string, optionIndex: number) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={optionIndex.toString()} id={`q${index}-o${optionIndex}`} />
                          <Label
                            htmlFor={`q${index}-o${optionIndex}`}
                            className={`cursor-pointer ${
                              quizSubmitted && optionIndex === question.correct
                                ? 'text-success font-medium'
                                : quizSubmitted && quizAnswers[index] === optionIndex && optionIndex !== question.correct
                                ? 'text-destructive'
                                : ''
                            }`}
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
                
                {!quizSubmitted && (
                  <Button 
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length < content.content.quiz.length}
                  >
                    Submit Quiz
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completion Button */}
        {user && currentProgress < 100 && (
          <div className="text-center">
            <Button onClick={handleMarkComplete} size="lg">
              Mark as Complete
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EducationalArticle;