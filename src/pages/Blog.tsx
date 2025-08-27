import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Blog = () => {
  const blogPosts = [
    {
      title: "Advanced Phishing Detection: AI vs Traditional Methods",
      excerpt: "Explore how modern AI techniques outperform traditional rule-based systems in identifying sophisticated phishing attacks.",
      category: "AI Technology",
      date: "Jan 15, 2025",
      readTime: "5 min read",
      featured: true
    },
    {
      title: "Mobile App Security: Red Flags to Watch For",
      excerpt: "Learn the key indicators that separate legitimate mobile apps from potentially malicious ones.",
      category: "Mobile Security",
      date: "Jan 10, 2025", 
      readTime: "7 min read",
      featured: false
    },
    {
      title: "The Evolution of Fraud: 2024 Threat Landscape Report",
      excerpt: "Comprehensive analysis of emerging fraud patterns and how businesses can stay protected.",
      category: "Threat Intelligence",
      date: "Dec 28, 2024",
      readTime: "12 min read",
      featured: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Security Blog</h1>
            <p className="text-xl text-muted-foreground">
              Latest insights on fraud detection, cybersecurity, and digital protection
            </p>
          </div>

          <div className="grid gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className={`${post.featured ? 'border-primary' : ''}`}>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={post.featured ? "default" : "secondary"}>
                      {post.category}
                    </Badge>
                    {post.featured && (
                      <Badge variant="outline">Featured</Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{post.title}</CardTitle>
                  <CardDescription className="text-base">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Read More <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              More articles coming soon. Stay tuned for the latest security insights!
            </p>
            <Button variant="outline">Subscribe to Updates</Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;