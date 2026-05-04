"use client";

import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const fetchFeaturedEvents = async () => {
  const { data } = await axiosInstance.get("/events?limit=6&isFeatured=true");
  // If no featured events, just get recent ones
  if (data.data?.events?.length === 0) {
      const { data: recentData } = await axiosInstance.get("/events?limit=6");
      return recentData.data;
  }
  return data.data; 
};

export default function FeaturedEvents() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start", skipSnaps: false });

  const { data, isLoading } = useQuery({
    queryKey: ["featured-events"],
    queryFn: fetchFeaturedEvents,
  });

  const events = data?.events || [];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-3">
              <Star className="w-4 h-4 fill-current" />
              <span>Editor's Choice</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Upcoming Highlights</h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Hand-picked events that are making waves in the community. Secure your spot before they sell out.
            </p>
          </div>
          <Button variant="outline" className="rounded-full px-8 group" asChild>
            <Link href="/events">
              View All Events <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[450px] bg-muted animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex gap-8 -ml-4">
              {events?.map((event: any, index: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="pl-4 min-w-[320px] md:min-w-[420px] pb-8" 
                  key={event.id}
                >
                  <Card className="h-full border-none bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] group flex flex-col shadow-lg shadow-black/5">
                    <div className="h-64 relative overflow-hidden rounded-[2.5rem] m-2">
                      <Image 
                        src={event.bannerImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000"} 
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-white/90 text-black border-none backdrop-blur shadow-sm font-bold">
                          {event.category?.name || "Premium"}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                        <div className="flex items-center gap-4 text-white text-xs font-bold uppercase tracking-tighter">
                           <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(event.date).toLocaleDateString()}
                           </div>
                           <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.venue || "Global"}
                           </div>
                        </div>
                      </div>
                    </div>
                    
                    <CardHeader className="pt-6">
                      <div className="flex justify-between items-start gap-4">
                        <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors leading-tight line-clamp-2">
                          {event.title}
                        </CardTitle>
                        <div className="text-2xl font-black text-primary">
                          {event.fee > 0 ? `$${event.fee}` : "Free"}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1">
                      <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                        {event.description}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="pt-0 pb-8 px-6">
                      <Button className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-primary/10 transition-all hover:scale-[1.02]" asChild>
                        <Link href={`/events/${event.id}`}>Experience Now</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
