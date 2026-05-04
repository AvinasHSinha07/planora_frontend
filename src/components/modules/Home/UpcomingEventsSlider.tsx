"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, MapPin, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";

gsap.registerPlugin(ScrollTrigger);

export default function UpcomingEventsSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchEvents = async () => {
      try {
        const { data } = await axiosInstance.get("/events?type=PUBLIC_FREE,PUBLIC_PAID&limit=9");
        setEvents(data.data || []);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!loading && containerRef.current) {
      const el = containerRef.current;
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        }
      );
    }
  }, [loading]);

  if (loading) return null; // Or a skeleton

  return (
    <section ref={containerRef} className="py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            Upcoming <span className="text-primary">Experiences</span>
          </motion.h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover and join the most anticipated public events happening soon.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Swiper
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards, Autoplay, Pagination]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="w-[280px] sm:w-[400px] md:w-[500px]"
          >
            {events.length > 0 ? events.map((event) => (
              <SwiperSlide key={event.id}>
                <Card className="h-[450px] overflow-hidden border-2 border-border/50 bg-background/80 backdrop-blur-xl flex flex-col group">
                  <div className="h-48 bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-secondary/40 mix-blend-overlay z-10" />
                    <img 
                      src={event.bannerImage || `https://source.unsplash.com/random/800x600/?event,party,${event.id}`} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 z-20">
                      <Badge className="backdrop-blur-md bg-background/80 text-foreground font-bold shadow-xl px-3 py-1">
                        {event.fee > 0 ? `$${event.fee}` : "Free"}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="flex flex-col flex-1 p-6 space-y-4 relative z-20">
                    <h3 className="text-2xl font-bold line-clamp-2 leading-tight">{event.title}</h3>
                    
                    <div className="space-y-2 mt-auto text-sm text-muted-foreground font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="line-clamp-1">{event.venue || "TBA"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" />
                        <span>{event.category?.name || "General"}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4 rounded-xl shadow-lg transition-transform hover:scale-105" asChild>
                      <Link href={`/events/${event.id}`}>Explore Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              </SwiperSlide>
            )) : (
              // Mock data if no events found
              [1, 2, 3, 4, 5].map((i) => (
                <SwiperSlide key={i}>
                  <Card className="h-[450px] flex items-center justify-center p-6 text-center border-dashed">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Sample Event {i}</h3>
                      <p className="text-muted-foreground text-sm">Create some public events to see them here.</p>
                    </div>
                  </Card>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
