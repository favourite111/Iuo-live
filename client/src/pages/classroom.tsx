import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  MonitorUp, 
  MessageSquare, 
  Users, 
  PhoneOff,
  Send,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import type { Class, ChatMessage } from "@shared/schema";
import type { User } from "@shared/models/auth";

function ChatPanel({ classId, user }: { classId: string; user: User }) {
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], refetch } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat", classId],
    refetchInterval: 3000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { classId: string; message: string }) => {
      const response = await apiRequest("POST", "/api/chat", data);
      return response.json();
    },
    onSuccess: () => {
      refetch();
      setMessage("");
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate({ classId, message: message.trim() });
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-3" data-testid={`chat-message-${msg.id}`}>
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-sm">User</span>
                  <span className="text-xs text-muted-foreground">
                    {msg.createdAt ? format(new Date(msg.createdAt), "h:mm a") : ""}
                  </span>
                </div>
                <p className="text-sm break-words">{msg.message}</p>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">
              No messages yet. Start the conversation!
            </p>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            data-testid="input-chat-message"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!message.trim() || sendMessageMutation.isPending}
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function Classroom() {
  const params = useParams<{ roomCode: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const { data: classData, isLoading: classLoading } = useQuery<Class>({
    queryKey: ["/api/classes/room", params.roomCode],
    enabled: !!params.roomCode,
  });

  if (authLoading || classLoading) {
    return (
      <div className="h-screen flex flex-col">
        <div className="p-4 border-b">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex-1 p-4">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-4">Please sign in to join this class.</p>
          <Button asChild>
            <a href="/api/login">Sign In</a>
          </Button>
        </Card>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="h-screen flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2">Class Not Found</h2>
          <p className="text-muted-foreground mb-4">This class doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const isLecturer = user.role === "lecturer" || user.role === "admin";
  const isLive = classData.status === "live";

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between gap-4 p-3 border-b bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild data-testid="button-back">
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-semibold text-sm truncate max-w-[200px] sm:max-w-none" data-testid="text-class-title">
              {classData.title}
            </h1>
            <div className="flex items-center gap-2">
              <Badge 
                variant={isLive ? "default" : "secondary"}
                className={isLive ? "bg-green-600" : ""}
              >
                {isLive ? "Live" : classData.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Room: {classData.roomCode}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" data-testid="button-toggle-chat">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>Class Chat</SheetTitle>
              </SheetHeader>
              <div className="h-[calc(100vh-80px)]">
                <ChatPanel classId={classData.id} user={user} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-hidden">
        <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center p-8">
            <VideoIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Video Stream</h2>
            <p className="text-muted-foreground max-w-md">
              {isLive 
                ? "Video streaming is active. In a production environment, this would display the live video feed."
                : "This class is not currently live. The lecturer will start the stream when ready."
              }
            </p>
            {isLecturer && !isLive && (
              <Button className="mt-4" data-testid="button-start-class">
                Start Class
              </Button>
            )}
          </div>
        </div>
      </main>

      <footer className="p-4 border-t bg-card">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={isMuted ? "secondary" : "default"}
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            data-testid="button-toggle-mic"
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button
            variant={isVideoOn ? "default" : "secondary"}
            size="icon"
            onClick={() => setIsVideoOn(!isVideoOn)}
            data-testid="button-toggle-video"
          >
            {isVideoOn ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          {isLecturer && (
            <Button
              variant={isSharing ? "default" : "secondary"}
              size="icon"
              onClick={() => setIsSharing(!isSharing)}
              data-testid="button-share-screen"
            >
              <MonitorUp className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="destructive"
            size="icon"
            asChild
            data-testid="button-leave"
          >
            <Link href="/dashboard">
              <PhoneOff className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}
