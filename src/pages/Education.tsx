import { useState, useEffect } from "react";
import { Search, BookOpen, Clock, Tag, Filter, CheckCircle, Play } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EducationalArticle from "@/components/EducationalArticle";
import ChatBot from "@/components/ChatBot";

interface EducationalCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface EducationalContent {
  id: string;
  title: string;
  slug: string;
  content: any;
  category_id: string;
  content_type: string;
  difficulty_level: string;
  estimated_reading_time: number;
  tags: string[];
  category?: EducationalCategory;
}

interface UserProgress {
  content_id: string;
  status: string;
  progress_percentage: number;
}

const Education = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<EducationalCategory[]>([]);
  const [content, setContent] = useState<EducationalContent[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [filteredContent, setFilteredContent] = useState<EducationalContent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null);
  const [showChatBot, setShowChatBot] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchContent();
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  useEffect(() => {
    filterContent();
  }, [content, selectedCategory, selectedDifficulty, selectedType, searchQuery]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("educational_categories")
      .select("*")
      .order("name");
    
    if (error) {
      console.error("Error fetching categories:", error);
      return;
    }
    
    setCategories(data || []);
  };

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from("educational_content")
      .select(`
        *,
        category:educational_categories(*)
      `)
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching content:", error);
      return;
    }
    
    setContent(data || []);
  };

  const fetchUserProgress = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("user_educational_progress")
      .select("*")
      .eq("user_id", user.id);
    
    if (error) {
      console.error("Error fetching progress:", error);
      return;
    }
    
    setUserProgress(data || []);
  };

  const filterContent = () => {
    let filtered = content;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category_id === selectedCategory);
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(item => item.difficulty_level === selectedDifficulty);
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(item => item.content_type === selectedType);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredContent(filtered);
  };

  const getProgressForContent = (contentId: string) => {
    const progress = userProgress.find(p => p.content_id === contentId);
    return progress?.progress_percentage || 0;
  };

  const getContentStatusIcon = (contentId: string) => {
    const progress = userProgress.find(p => p.content_id === contentId);
    if (progress?.status === "completed") {
      return <CheckCircle className="h-4 w-4 text-primary" />;
    }
    if (progress?.status === "in_progress") {
      return <Play className="h-4 w-4 text-secondary" />;
    }
    return null;
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-success text-success-foreground";
      case "intermediate": return "bg-secondary text-secondary-foreground";
      case "advanced": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article": return <BookOpen className="h-4 w-4" />;
      case "tutorial": return <Play className="h-4 w-4" />;
      case "checklist": return <CheckCircle className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  if (selectedContent) {
    return (
      <EducationalArticle
        content={selectedContent}
        userProgress={getProgressForContent(selectedContent.id)}
        onBack={() => setSelectedContent(null)}
        onProgressUpdate={fetchUserProgress}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Security Education Center</h1>
              <p className="text-muted-foreground text-lg">
                Learn to protect yourself from online threats with our comprehensive guides and tutorials.
              </p>
            </div>
            <Button
              onClick={() => setShowChatBot(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Ask AI Assistant
            </Button>
          </div>

          {user && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Your Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span>Overall Progress</span>
                      <span>{Math.round((userProgress.filter(p => p.status === "completed").length / content.length) * 100) || 0}%</span>
                    </div>
                    <Progress value={(userProgress.filter(p => p.status === "completed").length / content.length) * 100 || 0} />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userProgress.filter(p => p.status === "completed").length}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">All Categories</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6 space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles, tutorials, and guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="article">Articles</SelectItem>
                  <SelectItem value="tutorial">Tutorials</SelectItem>
                  <SelectItem value="checklist">Checklists</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Overview */}
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: category.color + '20', color: category.color }}>
                          {getTypeIcon(category.icon)}
                        </div>
                        {category.name}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{content.filter(c => c.category_id === category.id).length} resources</span>
                        {user && (
                          <span>
                            {userProgress.filter(p => 
                              content.find(c => c.id === p.content_id)?.category_id === category.id && 
                              p.status === "completed"
                            ).length} completed
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col"
                  onClick={() => setSelectedContent(item)}
                >
                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg leading-tight mb-2 flex items-start gap-2">
                        {getContentStatusIcon(item.id)}
                        {item.title}
                      </CardTitle>
                      {getTypeIcon(item.content_type)}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={getDifficultyColor(item.difficulty_level)}>
                        {item.difficulty_level}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.estimated_reading_time}m
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {user && (
                      <div className="mb-3">
                        <Progress value={getProgressForContent(item.id)} className="h-2" />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredContent.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No content found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </Tabs>
      </main>

      <Footer />
      
      {showChatBot && (
        <ChatBot onClose={() => setShowChatBot(false)} />
      )}
    </div>
  );
};

export default Education;