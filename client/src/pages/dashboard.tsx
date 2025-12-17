import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Video, Users, BookOpen, Plus, Clock, Play } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import type { Class } from "@shared/schema";
import type { User } from "@shared/models/auth";

function StatCard({ icon: Icon, title, value, description }: { 
  icon: any; 
  title: string; 
  value: string | number; 
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ClassCard({ classItem, user }: { classItem: Class; user: User }) {
  const isLecturer = user.role === "lecturer" || user.role === "admin";
  const isLive = classItem.status === "live";
  const scheduledDate = new Date(classItem.scheduledAt);
  
  return (
    <Card className="hover-elevate" data-testid={`card-class-${classItem.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{classItem.title}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {format(scheduledDate, "MMM d, yyyy 'at' h:mm a")}
            </CardDescription>
          </div>
          <Badge 
            variant={isLive ? "default" : "secondary"}
            className={isLive ? "bg-green-600" : ""}
          >
            {isLive ? "Live" : classItem.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {classItem.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{classItem.description}</p>
        )}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{classItem.duration} min</span>
          </div>
          <Button size="sm" asChild data-testid={`button-join-class-${classItem.id}`}>
            <Link href={`/class/${classItem.roomCode}`}>
              {isLive ? (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Join
                </>
              ) : (
                "View"
              )}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  
  const { data: classes = [], isLoading: classesLoading } = useQuery<Class[]>({
    queryKey: ["/api/classes"],
    enabled: !!user,
  });

  const { data: lecturerClasses = [] } = useQuery<Class[]>({
    queryKey: ["/api/lecturer/classes"],
    enabled: !!user && (user.role === "lecturer" || user.role === "admin"),
  });

  if (authLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isLecturer = user.role === "lecturer" || user.role === "admin";
  const displayClasses = isLecturer ? lecturerClasses : classes;
  const upcomingClasses = displayClasses.filter(c => c.status === "scheduled");
  const liveClasses = displayClasses.filter(c => c.status === "live");

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
            <AvatarFallback>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-welcome">
              Welcome, {user.firstName || "User"}
            </h1>
            <p className="text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>
        {isLecturer && (
          <Button asChild data-testid="button-create-class">
            <Link href="/schedule">
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Video}
          title="Live Classes"
          value={liveClasses.length}
          description="Currently active"
        />
        <StatCard
          icon={Calendar}
          title="Upcoming"
          value={upcomingClasses.length}
          description="Scheduled classes"
        />
        <StatCard
          icon={isLecturer ? Users : BookOpen}
          title={isLecturer ? "Total Classes" : "Enrolled"}
          value={displayClasses.length}
          description={isLecturer ? "Classes created" : "Your classes"}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold" data-testid="text-section-classes">
            {isLecturer ? "Your Classes" : "Available Classes"}
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/recordings">View Recordings</Link>
          </Button>
        </div>

        {classesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : displayClasses.length === 0 ? (
          <Card className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Classes Yet</h3>
            <p className="text-muted-foreground mb-4">
              {isLecturer 
                ? "Create your first class to get started"
                : "No classes are available at the moment"
              }
            </p>
            {isLecturer && (
              <Button asChild>
                <Link href="/schedule">Create Class</Link>
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayClasses.map(classItem => (
              <ClassCard key={classItem.id} classItem={classItem} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
