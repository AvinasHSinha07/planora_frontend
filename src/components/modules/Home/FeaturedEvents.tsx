"use client";

import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fetchFeaturedEvents = async () => {
  const { data } = await axiosInstance.get("/events");
  return data.data; // Ideally, we filter by isFeatured
};

export default function FeaturedEvents() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });

  const { data: events, isLoading } = useQuery({
    queryKey: ["featured-events"],
    queryFn: fetchFeaturedEvents,
  });

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Upcoming Highlights</h2>
            <p className="text-muted-foreground mt-2">Don't miss out on these featured events</p>
          </div>
        </div>

        {isLoading ? (
          <p>Loading featured events...</p>
        ) : (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 -ml-4">
              {events?.map((event: any) => (
                <div className="pl-4 min-w-[300px] md:min-w-[400px]" key={event.id}>
                  <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
                    <div className="h-48 bg-muted rounded-t-xl relative overflow-hidden">
                      {/* Image placeholder */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-secondary/40" />
                      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur rounded px-2 py-1 text-xs font-bold">
                        {event.fee > 0 ? `$${event.fee}` : "Free"}
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl line-clamp-1">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">View Details</Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
