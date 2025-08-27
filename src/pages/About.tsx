import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Globe, Zap, Award, Target } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-founder",
      bio: "Former cybersecurity lead at Google with 15+ years in AI and fraud detection.",
      expertise: ["AI/ML", "Cybersecurity", "Leadership"]
    },
    {
      name: "Marcus Rodriguez", 
      role: "CTO & Co-founder",
      bio: "Ex-Microsoft principal engineer specializing in real-time threat detection systems.",
      expertise: ["System Architecture", "Real-time Processing", "Security"]
    },
    {
      name: "Dr. Emily Watson",
      role: "Head of AI Research",
      bio: "PhD in Computer Vision from Stanford, published 50+ papers on fraud detection.",
      expertise: ["Computer Vision", "NLP", "Research"]
    }
  ];

  const milestones = [
    { year: "2023", event: "Company Founded", description: "Started with a mission to democratize fraud detection" },
    { year: "2023", event: "First AI Model", description: "Launched our proprietary phishing detection algorithm" },
    { year: "2024", event: "Series A Funding", description: "Raised $10M to expand our AI capabilities" },
    { year: "2024", event: "Global Expansion", description: "Now protecting users in 50+ countries" },
    { year: "2025", event: "50M+ URLs Analyzed", description: "Reached major milestone in threat detection" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">About FraudGuard AI</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're on a mission to make the internet safer for everyone through cutting-edge AI technology 
              that detects and prevents fraud before it can cause harm.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To democratize access to advanced fraud detection technology, making it easy for individuals 
                  and businesses of all sizes to protect themselves against evolving digital threats.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A world where everyone can navigate the digital landscape with confidence, protected by 
                  intelligent systems that learn and adapt to new threats in real-time.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Key Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2">99.7%</div>
              <div className="text-sm text-muted-foreground">Detection Accuracy</div>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2">1M+</div>
              <div className="text-sm text-muted-foreground">Protected Users</div>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2">50M+</div>
              <div className="text-sm text-muted-foreground">URLs Analyzed</div>
            </div>
          </div>

          {/* Team Section */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Meet Our Team</CardTitle>
              <CardDescription>
                Industry experts dedicated to advancing AI-powered security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-muted w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {member.expertise.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Company Timeline */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Our Journey
              </CardTitle>
              <CardDescription>
                Key milestones in our mission to make the internet safer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {milestone.year.slice(-2)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{milestone.event}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Join Us in Making the Internet Safer</h2>
            <p className="text-muted-foreground mb-6">
              Whether you're an individual looking for protection or a business needing enterprise security,
              we're here to help.
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90">
                Get Started
              </button>
              <button className="border border-border px-6 py-2 rounded-lg font-medium hover:bg-muted">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;