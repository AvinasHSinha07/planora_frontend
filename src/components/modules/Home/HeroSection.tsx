"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current?.children || [], {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        delay: 0.2
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-16">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-secondary/10 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] rounded-full bg-primary/5 blur-[120px]" />
        
        {/* Abstract Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} 
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20 text-center" ref={textRef}>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs sm:text-sm font-bold text-primary mb-8 animate-fade-in backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Planora Elite Experiences
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[1.05] md:leading-[0.95]">
          Elevate Your <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient">
            Event Vision.
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-4">
          The ultimate ecosystem for discovering, organizing, and monetizing premium experiences. 
          Where every interaction is crafted for excellence.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6">
          <Button size="lg" asChild className="rounded-full h-14 px-10 text-lg font-bold shadow-2xl shadow-primary/30 w-full sm:w-auto hover:scale-105 transition-transform">
            <Link href="/events">Explore Elite Events</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="rounded-full h-14 px-10 text-lg font-bold w-full sm:w-auto border-primary/20 hover:bg-primary/5 transition-all">
            <Link href="/dashboard">Host an Experience</Link>
          </Button>
        </div>

        {/* Stats Overlay for desktop/tablet */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-10 border-t border-primary/10">
          <div className="space-y-1">
            <h4 className="text-2xl md:text-3xl font-black text-primary">10k+</h4>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Users</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl md:text-3xl font-black text-primary">500+</h4>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Hosted Events</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl md:text-3xl font-black text-primary">50+</h4>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Elite Cities</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl md:text-3xl font-black text-primary">4.9/5</h4>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">User Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}
