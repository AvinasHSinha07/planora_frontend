"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar, MapPin, Users, Info } from "lucide-react";

export default function EventDetailsClient() {
  const { id } = useParams();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/events/${id}`);
      return data.data;
    },
  });

  const handleJoin = async () => {
    try {
      if (event.fee > 0) {
        // Stripe integration hit
        const { data } = await axiosInstance.post("/payments/create-session", { eventId: event.id });
        if (data.data?.url) {
          window.location.href = data.data.url;
        }
      } else {
        await axiosInstance.post("/participations/join", { eventId: event.id });
        toast.success("Successfully joined the event!");
      }
    } catch (error) {
      toast.error("Failed to join event");
    }
  };

  if (isLoading) return <div className="container mx-auto py-24 text-center">Loading event details...</div>;
  if (!event) return <div className="container mx-auto py-24 text-center">Event not found</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="w-full h-64 md:h-96 bg-muted rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30" />
          </div>
          
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">{event.title}</h1>
            <p className="text-lg text-muted-foreground mt-4">{event.description}</p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold mb-4">About this Event</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="text-primary" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-primary" />
                <span>{event.venue || "TBA"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-primary" />
                <span>{event.participants?.length || 0} Attending</span>
              </div>
              <div className="flex items-center gap-3">
                <Info className="text-primary" />
                <span>{event.eventType.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-card border rounded-2xl p-6 shadow-xl sticky top-24">
            <div className="text-center mb-6">
              <span className="text-3xl font-bold">
                {event.fee > 0 ? `$${event.fee}` : "Free"}
              </span>
            </div>
            
            <Button size="lg" className="w-full text-lg h-14" onClick={handleJoin}>
              {event.fee > 0 ? "Pay & Join" : "Join Event"}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-4">
              By joining you agree to the Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
