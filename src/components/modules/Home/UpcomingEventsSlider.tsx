"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, MapPin, Tag, ArrowRight, Sparkles, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function UpcomingEventsSlider({ initialData }: { initialData?: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<any[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      if (initialData) return;
      try {
        const { data } = await axiosInstance.get("/events?type=PUBLIC_FREE,PUBLIC_PAID&limit=6");
        setEvents(data.data?.events || []);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [initialData]);

  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, [loading]);

  const isUnoptimized = (url: string) => url?.includes("ellaslist.com.au");

  if (!mounted || loading || events.length === 0) return null;

  return (
    <section ref={containerRef} className="relative py-32 bg-background overflow-hidden">
      {/* Dynamic Background Blur */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={events[activeIndex]?.bannerImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070"}
            alt="bg"
            fill
            priority
            unoptimized={isUnoptimized(events[activeIndex]?.bannerImage)}
            className="object-cover blur-[100px] scale-110"
          />
        </motion.div>
      </AnimatePresence>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="lg:w-1/3 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full mb-6 font-bold tracking-wider uppercase text-xs">
                <Sparkles className="w-3 h-3 mr-2 inline-block" />
                Featured Experiences
              </Badge>
              <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6">
                Redefining <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Live Events</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join our curated selection of high-impact gatherings. From tech summits to cultural festivals, discover your next big moment.
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Button size="lg" className="rounded-full px-8 h-14 text-lg font-bold shadow-xl shadow-primary/25" asChild>
                <Link href="/events">Explore All Events</Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg font-bold backdrop-blur-md">
                How it Works
              </Button>
            </div>
          </div>

          {/* Slider Section */}
          <div className="lg:w-2/3 w-full">
            <Swiper
              modules={[Autoplay, Navigation, Pagination, EffectCreative]}
              grabCursor={true}
              effect={"creative"}
              creativeEffect={{
                prev: {
                  shadow: true,
                  translate: ["-120%", 0, -500],
                },
                next: {
                  shadow: true,
                  translate: ["120%", 0, -500],
                },
              }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              className="w-full h-[550px] md:h-[650px] rounded-[3rem]"
            >
              {events.map((event, index) => (
                <SwiperSlide key={event.id} className="rounded-[3rem] overflow-hidden">
                  <div className="relative w-full h-full group">
                    {/* Main Image */}
                    <Image
                      src={event.bannerImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070"}
                      alt={event.title}
                      fill
                      priority={index === 0}
                      unoptimized={isUnoptimized(event.bannerImage)}
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                    
                    {/* Content Card (Glassmorphism) */}
                    <div className="absolute bottom-8 left-8 right-8 z-20">
                      <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={activeIndex === index ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="p-8 rounded-[2.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl space-y-6"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <Badge className="bg-white/20 text-white border-none backdrop-blur-md font-bold mb-2">
                              {event.category?.name || "Event"}
                            </Badge>
                            <h3 className="text-3xl md:text-4xl font-black text-white leading-none">
                              {event.title}
                            </h3>
                          </div>
                          <div className="bg-primary text-white font-black px-4 py-2 rounded-2xl text-xl shadow-lg">
                            {event.fee > 0 ? `$${event.fee}` : "FREE"}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                              <Calendar className="w-4 h-4" />
                            </div>
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                              <Clock className="w-4 h-4" />
                            </div>
                            {new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <span className="line-clamp-1">{event.venue || "TBA"}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                           <div className="flex -space-x-3">
                              {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-black/20 overflow-hidden bg-muted">
                                  <Image src={`https://i.pravatar.cc/150?u=${event.id}${i}`} alt="avatar" width={40} height={40} />
                                </div>
                              ))}
                              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white border-2 border-black/20">
                                +12
                              </div>
                           </div>
                           <Button asChild className="rounded-full px-6 h-12 bg-white text-black hover:bg-white/90 group/btn">
                              <Link href={`/events/${event.id}`}>
                                View Details <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                              </Link>
                           </Button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute -left-24 top-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px] z-0" />
      <div className="absolute -right-24 bottom-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[150px] z-0" />
    </section>
  );
}
