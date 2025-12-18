import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Video, Calendar, Users, BookOpen, Shield } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Video,
      title: "Live Video Classes",
      description: "High-quality video streaming for real-time lectures and interactive sessions"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Easy class scheduling with automated reminders and calendar integration"
    },
    {
      icon: Users,
      title: "Student Management",
      description: "Track attendance, manage enrollments, and monitor student progress"
    },
    {
      icon: BookOpen,
      title: "Class Recordings",
      description: "Access recorded sessions anytime for revision and catch-up"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security to protect your educational content"
    },
    {
      icon: GraduationCap,
      title: "IUTH Certified",
      description: "Official platform of Igbinedion University Teaching Hospital"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold" data-testid="text-logo">IUTH Live Class</span>
            </div>
            <Button asChild data-testid="button-login">
              <a href="/login">Sign In</a>
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6" data-testid="text-hero-title">
            Virtual Classroom for
            <span className="block text-primary">Medical Excellence</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8" data-testid="text-hero-description">
            Igbinedion University Teaching Hospital's official platform for live online classes, 
            student management, and seamless virtual learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild data-testid="button-get-started">
              <a href="/register">Get Started</a>
            </Button>
            <Button size="lg" variant="outline" data-testid="button-learn-more">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" data-testid="text-features-title">Platform Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for effective online medical education
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate" data-testid={`card-feature-${index}`}>
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" data-testid="text-cta-title">Ready to Transform Your Learning?</h2>
          <p className="text-muted-foreground mb-8">
            Join hundreds of students and lecturers already using IUTH Live Class
          </p>
          <Button size="lg" asChild data-testid="button-join-now">
            <a href="/register">Join Now</a>
          </Button>
        </div>
      </section>

      <footer className="py-8 px-4 border-t bg-muted/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-semibold">IUTH Live Class</span>
          </div>
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            Igbinedion University Teaching Hospital. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
