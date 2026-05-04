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

      <div className="rounded-3xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-[300px] py-4 px-6">Event Details</TableHead>
              <TableHead className="py-4">Event Date</TableHead>
              <TableHead className="py-4">Participants</TableHead>
              <TableHead className="py-4">Status</TableHead>
              <TableHead className="py-4 text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event: any) => (
              <TableRow key={event.id} className="group transition-colors duration-300">
                <TableCell className="py-4 px-6">
                   <div className="flex flex-col gap-1">
                      <span className="font-bold text-lg group-hover:text-primary transition-colors">{event.title}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                         <Badge variant="secondary" className="bg-primary/5 text-primary text-[10px] uppercase border-none px-2 h-5">
                            {event.category?.name || "Uncategorized"}
                         </Badge>
                      </span>
                   </div>
                </TableCell>
                <TableCell className="py-4">
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      {format(new Date(event.date), "MMM d, yyyy")}
                   </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex -space-x-2 overflow-hidden">
                    {(event.participants || []).slice(0, 3).map((participant: any) => (
                      <Avatar key={participant.id} className="inline-block border-2 border-background w-8 h-8 shadow-sm">
                        <AvatarImage src={participant.user?.image || participant.user?.avatar} />
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                          {participant.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {(event.participants?.length || 0) > 3 && (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-[10px] font-bold border-2 border-background text-muted-foreground">
                         +{(event.participants.length - 3)}
                      </div>
                    )}
                    {event.participants?.length === 0 && (
                      <span className="text-xs text-muted-foreground">0 Participants</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                   <Badge variant="outline" className="rounded-full font-mono text-[10px] uppercase tracking-tighter">
                      {event.eventType?.replace("_", " ") || "N/A"}
                   </Badge>
                </TableCell>
                <TableCell className="py-4 text-right px-6">
                   <ManageParticipantsDialog eventId={event.id} eventTitle={event.title} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
