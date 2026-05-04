"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardEventsClient() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["my-events"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/events");
      // This should ideally hit a /events/me endpoint in a real scenario
      return data.data; 
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
        <Button>Create New Event</Button>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Event Title</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Fee</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
            )}
            {events?.map((event: any) => (
              <tr key={event.id} className="border-t hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium">{event.title}</td>
                <td className="px-6 py-4">{new Date(event.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {event.eventType}
                  </span>
                </td>
                <td className="px-6 py-4">${event.fee}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
