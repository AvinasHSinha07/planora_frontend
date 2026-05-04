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

export default function MyEventsClient() {
  const queryClient = useQueryClient();
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["my-events"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/events");
      return data.data;
    },
  });

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Events</h2>
          <p className="text-muted-foreground">
            Manage the events you are organizing.
          </p>
        </div>
        <CreateEventDialog />
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
            <Card key={event.id} className="flex flex-col overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(event.date, "MMM d, yyyy • h:mm a")}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/events/${event.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <EditEventDialog event={event} />
                      <ManageParticipantsDialog eventId={event.id} eventTitle={event.title} triggerType="menuitem" />
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDelete(event.id)}
                      >
                        Delete Event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1">{event.venue || "Online"}</span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {event.participants?.length || 0}
                  </div>
                  <Badge variant={(event.eventType || "").includes("FREE") ? "secondary" : "default"}>
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
