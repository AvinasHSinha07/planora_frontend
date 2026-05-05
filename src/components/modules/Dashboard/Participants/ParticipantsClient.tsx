"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Search, MoreHorizontal, Calendar, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";
import ManageParticipantsDialog from "../Events/ManageParticipantsDialog";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";

export default function ParticipantsClient() {
  const [search, setSearch] = useState("");

  const { data: session } = authClient.useSession();
  const { data, isLoading } = useQuery({
    queryKey: ["my-events-participants", session?.user?.id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/events?limit=100&organizerId=${session?.user?.id}`);
      return data.data;
    },
    enabled: !!session?.user?.id,
  });

  const events = data?.events || [];

  const filteredEvents = events.filter((event: any) => 
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center bg-muted/20">
        <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-xl font-bold">No Participants Yet</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          You haven't organized any events yet, or no one has joined your events.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Filter by event name..." 
          className="pl-10 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-[2rem] sm:rounded-[3rem] border border-border/40 bg-card overflow-hidden shadow-2xl hidden md:block">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-[300px] py-6 px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Event Details</TableHead>
              <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Event Date</TableHead>
              <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Participants</TableHead>
              <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</TableHead>
              <TableHead className="py-6 text-right px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event: any) => (
              <TableRow key={event.id} className="group transition-colors duration-500 hover:bg-muted/30">
                <TableCell className="py-6 px-8">
                   <div className="flex flex-col gap-1">
                      <span className="font-black text-lg tracking-tight group-hover:text-primary transition-colors italic uppercase">{event.title}</span>
                      <div className="flex items-center gap-2">
                         <Badge variant="secondary" className="bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest border-none px-2 h-5">
                            {event.category?.name || "Uncategorized"}
                         </Badge>
                      </div>
                   </div>
                </TableCell>
                <TableCell className="py-6">
                   <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground italic">
                      <Calendar className="w-4 h-4 text-primary" />
                      {format(new Date(event.date), "MMM d, yyyy")}
                   </div>
                </TableCell>
                <TableCell className="py-6">
                   <div className="flex items-center gap-3">
                      <div className="flex -space-x-2.5 overflow-hidden">
                        {(event.participants || []).slice(0, 3).map((participant: any) => (
                          <Avatar key={participant.id} className="inline-block border-2 border-background w-9 h-9 shadow-lg">
                            <AvatarImage src={participant.user?.image || participant.user?.avatar} />
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-black">
                              {participant.user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {(event.participants?.length || 0) > 3 && (
                          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted text-[10px] font-black border-2 border-background text-muted-foreground shadow-lg">
                             +{(event.participants.length - 3)}
                          </div>
                        )}
                      </div>
                      {event.participants?.length === 0 && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Zero Enrolled</span>
                      )}
                   </div>
                </TableCell>
                <TableCell className="py-6">
                   <Badge variant="outline" className="rounded-full font-black text-[10px] uppercase tracking-widest italic border-primary/20 text-primary px-3">
                      {event.eventType?.replace("_", " ") || "N/A"}
                   </Badge>
                </TableCell>
                <TableCell className="py-6 text-right px-8">
                   <ManageParticipantsDialog eventId={event.id} eventTitle={event.title} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile - Card View */}
      <div className="md:hidden space-y-4">
         {filteredEvents.map((event: any) => (
            <Card key={event.id} className="rounded-[1.5rem] sm:rounded-[2rem] border border-border/40 overflow-hidden shadow-lg bg-card group">
               <CardContent className="p-5 space-y-4">
                  <div className="space-y-1">
                     <div className="flex justify-between items-start gap-2">
                        <h4 className="font-black text-base uppercase italic tracking-tight group-hover:text-primary transition-colors">{event.title}</h4>
                        <Badge variant="outline" className="rounded-full font-black text-[9px] uppercase tracking-widest italic border-primary/20 text-primary shrink-0">
                           {event.eventType?.replace("_", " ") || "N/A"}
                        </Badge>
                     </div>
                     <Badge variant="secondary" className="bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest border-none px-2 h-5">
                        {event.category?.name || "Uncategorized"}
                     </Badge>
                  </div>

                  <div className="flex items-center justify-between py-3 border-y border-border/10">
                     <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground italic">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {format(new Date(event.date), "MMM d, yyyy")}
                     </div>
                     <div className="flex -space-x-2 overflow-hidden">
                        {(event.participants || []).slice(0, 3).map((participant: any) => (
                          <Avatar key={participant.id} className="inline-block border-2 border-background w-7 h-7">
                            <AvatarImage src={participant.user?.image || participant.user?.avatar} />
                            <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-black">
                              {participant.user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {(event.participants?.length || 0) > 3 && (
                          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted text-[8px] font-black border-2 border-background text-muted-foreground">
                             +{(event.participants.length - 3)}
                          </div>
                        )}
                        {event.participants?.length === 0 && (
                           <span className="text-[10px] font-black text-muted-foreground opacity-50 italic">No Enrollees</span>
                        )}
                     </div>
                  </div>

                  <div className="pt-1">
                     <ManageParticipantsDialog eventId={event.id} eventTitle={event.title} triggerType="button" />
                  </div>
               </CardContent>
            </Card>
         ))}
      </div>
    </div>
  );
}
