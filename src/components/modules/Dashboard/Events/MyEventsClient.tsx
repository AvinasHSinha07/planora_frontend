"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, MapPin, MoreHorizontal, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import CreateEventDialog from "./CreateEventDialog";
import EditEventDialog from "./EditEventDialog";
import ManageParticipantsDialog from "./ManageParticipantsDialog";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, Tag, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function MyEventsClient() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["my-events", session?.user?.id, debouncedSearchTerm, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("limit", "100");
      params.append("organizerId", session?.user?.id as string);
      if (debouncedSearchTerm) params.append("searchTerm", debouncedSearchTerm);
      if (category !== "all") params.append("category", category);
      
      const { data } = await axiosInstance.get(`/events?${params.toString()}`);
      return data.data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/categories");
      return data.data;
    },
  });

  const events = data?.events || [];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await axiosInstance.delete(`/events/${id}`);
      toast.success("Event deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete event");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-card/50 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-border/50 shadow-sm">
        <div className="space-y-1 text-center xl:text-left">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase italic leading-none">
             My <span className="text-primary">Events</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium italic">Manage and track your organized event portfolio.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1 sm:min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search your events..." 
              className="pl-12 rounded-2xl h-12 bg-background/50 border-none focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col xs:flex-row items-center gap-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full xs:w-[180px] rounded-2xl h-12 bg-background/50 border-none">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 shrink-0 text-primary" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="w-full xs:w-auto">
               <CreateEventDialog />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[200px] bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="mt-4 text-lg font-semibold">No events created</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              You haven't created any events yet. Click the button below to get started.
            </p>
            <CreateEventDialog />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event: any) => (
            <Card key={event.id} className="flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl rounded-[2rem] border-border/40 group relative">
              <CardHeader className="p-5 sm:p-6 pb-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 min-w-0">
                    <CardTitle className="text-xl sm:text-2xl font-black tracking-tight uppercase italic line-clamp-1 group-hover:text-primary transition-colors">
                       {event.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {format(new Date(event.date), "MMM d, yyyy • h:mm a")}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-10 w-10 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-colors shrink-0">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[180px]">
                      <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-3 py-2">Management</DropdownMenuLabel>
                      <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/10 focus:text-primary cursor-pointer font-bold">
                        <Link href={`/events/${event.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <EditEventDialog event={event} />
                      <ManageParticipantsDialog eventId={event.id} eventTitle={event.title} triggerType="menuitem" />
                      <DropdownMenuSeparator className="my-2 bg-border/50" />
                      <DropdownMenuItem 
                        className="text-destructive rounded-xl focus:bg-destructive/10 focus:text-destructive cursor-pointer font-bold"
                        onClick={() => handleDelete(event.id)}
                      >
                        Delete Event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="px-5 sm:px-6 pb-6 mt-auto space-y-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
                  <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="line-clamp-1 italic">{event.venue || "Online Deployment"}</span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0 border border-border/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-500">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-xs font-black tracking-tighter leading-none">{event.participants?.length || 0}</span>
                       <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Attendees</span>
                    </div>
                  </div>
                  <Badge 
                    variant={(event.eventType || "").includes("FREE") ? "secondary" : "default"}
                    className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest italic"
                  >
                    {(event.eventType || "N/A").replace("_", " ")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
