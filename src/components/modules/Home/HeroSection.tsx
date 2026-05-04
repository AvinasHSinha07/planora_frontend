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
    <section ref={containerRef} className="relative overflow-hidden bg-muted/20 py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent z-0" />
      <div className="container relative z-10 mx-auto px-4 text-center" ref={textRef}>
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          Planora - The Premium Event Platform
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Unforgettable Events, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Seamlessly Managed.
          </span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Discover, create, and monetize premium events. The all-in-one platform for organizers and attendees.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" asChild className="rounded-full h-12 px-8 text-base shadow-lg shadow-primary/20">
            <Link href="/events">Explore Events</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="rounded-full h-12 px-8 text-base">
            <Link href="/dashboard">Create Event</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
