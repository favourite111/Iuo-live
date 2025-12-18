import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Play, Clock, Search, Video } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { useState } from "react";
import type { Recording } from "@shared/schema";

function RecordingCard({ recording }: { recording: Recording }) {
  const createdDate = recording.createdAt ? new Date(recording.createdAt) : new Date();
  
  return (
    <Card className="overflow-hidden hover-elevate" data-testid={`card-recording-${recording.id}`}>
      <div className="relative aspect-video bg-muted">
        {recording.thumbnailUrl ? (
          <img 
            src={recording.thumbnailUrl} 
            alt={recording.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Video className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="icon" variant="secondary" className="rounded-full">
            <Play className="h-6 w-6" />
          </Button>
        </div>
        {recording.duration && (
          <Badge className="absolute bottom-2 right-2" variant="secondary">
            {Math.floor(recording.duration / 60)}:{(recording.duration % 60).toString().padStart(2, '0')}
          </Badge>
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-base line-clamp-2">{recording.title}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" />
          {format(createdDate, "MMM d, yyyy")}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default function Recordings() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: recordings = [], isLoading } = useQuery<Recording[]>({
    queryKey: ["/api/recordings"],
  });

  const filteredRecordings = recordings.filter(recording =>
    recording.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2" data-testid="button-back">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Recordings Library</h1>
          <p className="text-muted-foreground">Access recorded class sessions</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search recordings..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-video" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredRecordings.length === 0 ? (
        <Card className="p-8 text-center">
          <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {searchQuery ? "No Recordings Found" : "No Recordings Yet"}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? "Try a different search term"
              : "Recordings will appear here after classes end"
            }
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecordings.map(recording => (
            <RecordingCard key={recording.id} recording={recording} />
          ))}
        </div>
      )}
    </div>
  );
}
