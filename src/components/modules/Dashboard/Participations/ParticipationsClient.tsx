"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Loader2, Ticket, CheckCircle2, Clock, XCircle, Ban } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function ParticipationsClient() {
  const { data: participations = [], isLoading } = useQuery({
    queryKey: ["my-participations"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/participations/my-participations");
      return data.data;
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "PENDING": return <Clock className="w-4 h-4 text-amber-500" />;
      case "REJECTED": return <XCircle className="w-4 h-4 text-destructive" />;
      case "BANNED": return <Ban className="w-4 h-4 text-black" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (participations.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center bg-muted/20">
        <Ticket className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-xl font-bold">No Events Joined</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          You haven't joined any events yet. Explore events and start participating!
        </p>
        <Button asChild className="mt-6 rounded-xl">
           <Link href="/events">Explore Events</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {participations.map((p: any) => (
        <Card key={p.id} className="overflow-hidden rounded-[2rem] border-border/50 hover:shadow-2xl transition-all duration-500 flex flex-col group">
          <CardHeader className="p-0">
             <div className="relative h-40 w-full overflow-hidden">
                <img 
                  src={p.event.bannerImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop"} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={p.event.title}
                />
                <div className="absolute top-4 left-4">
                   <Badge variant="secondary" className="bg-background/80 backdrop-blur-md text-foreground border-none">
                      {p.event.category?.name}
                   </Badge>
                </div>
                <div className="absolute top-4 right-4">
                   <Badge 
                      className={`
                        shadow-lg backdrop-blur-md border-none px-3 py-1 gap-2
                        ${p.status === "APPROVED" ? "bg-emerald-500/90 text-white" : ""}
                        ${p.status === "PENDING" ? "bg-amber-500/90 text-white" : ""}
                        ${p.status === "REJECTED" ? "bg-destructive/90 text-white" : ""}
                        ${p.status === "BANNED" ? "bg-black text-white" : ""}
                      `}
                    >
                      {getStatusIcon(p.status)}
                      {p.status}
                    </Badge>
                </div>
             </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-4 flex-1">
            <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">{p.event.title}</CardTitle>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {format(new Date(p.event.date), "MMM d, yyyy • h:mm a")}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {p.event.venue || "Online"}
              </div>
            </div>

            <div className="pt-4 border-t border-border/30 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                     <AvatarImage src={p.event.organizer.image || p.event.organizer.avatar} />
                     <AvatarFallback>{p.event.organizer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                     Hosted by {p.event.organizer.name}
                  </span>
               </div>
               {p.event.fee > 0 && (
                 <Badge variant="outline" className="text-emerald-600 font-mono">
                    ${p.event.fee}
                 </Badge>
               )}
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0">
            <Button asChild className="w-full rounded-2xl gap-2" variant={p.status === "APPROVED" ? "default" : "secondary"}>
               <Link href={`/events/${p.event.id}`}>
                  {p.status === "APPROVED" ? "View Event Page" : "View Details"}
               </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
