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

export default function FeaturedEvents({ initialData }: { initialData: any }) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start", skipSnaps: false });

  const { data, isLoading } = useQuery({
    queryKey: ["featured-events"],
    queryFn: fetchFeaturedEvents,
    initialData: initialData,
  });

  const events = data?.events || [];

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-[10px] md:text-xs mb-3">
              <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
              <span>Editor's Choice</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">Upcoming Highlights</h2>
            <p className="text-muted-foreground mt-4 text-base md:text-lg">
              Hand-picked events that are making waves in the community. Secure your spot before they sell out.
            </p>
          </div>
          <Button variant="outline" className="rounded-full px-6 md:px-8 group w-full md:w-auto" asChild>
            <Link href="/events">
              View All Events <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[400px] md:h-[450px] bg-muted animate-pulse rounded-[1.5rem] md:rounded-[2.5rem]" />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex gap-4 md:gap-8 -ml-4">
              {events?.map((event: any, index: number) => (
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.1 }}
                   className="pl-4 min-w-[280px] w-[85vw] sm:w-[400px] md:min-w-[420px] pb-8" 
                   key={event.id}
                >
                  <Card className="h-full border-none bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-2xl transition-all duration-500 rounded-[1.5rem] md:rounded-[2.5rem] group flex flex-col shadow-lg shadow-black/5">
                    <div className="h-48 sm:h-56 md:h-64 relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] m-2">
                      <Image 
                        src={event.bannerImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000"} 
                        alt={event.title}
                        fill
                        priority={index < 2}
                        unoptimized={event.bannerImage?.includes("ellaslist.com.au")}
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10">
                        <Badge className="bg-white/90 text-black border-none backdrop-blur shadow-sm font-bold text-[10px] md:text-xs">
                          {event.category?.name || "Premium"}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader className="pt-4 md:pt-6">
                      <div className="flex justify-between items-start gap-4">
                        <CardTitle className="text-xl md:text-2xl font-black group-hover:text-primary transition-colors leading-tight line-clamp-2">
                          {event.title}
                        </CardTitle>
                        <div className="text-xl md:text-2xl font-black text-primary shrink-0">
                          {event.fee > 0 ? `$${event.fee}` : "Free"}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1">
                      <p className="text-muted-foreground line-clamp-2 md:line-clamp-3 text-xs md:text-sm leading-relaxed">
                        {event.description}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="pt-0 pb-6 md:pb-8 px-4 md:px-6">
                      <Button className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl font-bold shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] text-sm md:text-base" asChild>
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
