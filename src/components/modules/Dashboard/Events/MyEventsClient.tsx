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

// This would typically come from an API
const mockEvents = [
  {
    id: "1",
    title: "Global Tech Summit 2026",
    date: new Date("2026-06-15T09:00:00"),
    venue: "Convention Center",
    status: "Upcoming",
    type: "PUBLIC_PAID",
    participants: 120,
    revenue: 12000,
  },
  {
    id: "2",
    title: "Startup Networking Mixer",
    date: new Date("2026-05-20T18:00:00"),
    venue: "Downtown Hub",
    status: "Upcoming",
    type: "PRIVATE_FREE",
    participants: 45,
    revenue: 0,
  },
];

export default function MyEventsClient() {
  const [events, setEvents] = useState(mockEvents);

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

      {events.length === 0 ? (
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
          {events.map((event) => (
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Event</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete Event</DropdownMenuItem>
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
                    {event.participants}
                  </div>
                  <Badge variant={event.type.includes("FREE") ? "secondary" : "default"}>
                    {event.type.replace("_", " ")}
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
