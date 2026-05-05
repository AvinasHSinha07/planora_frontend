"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 md:py-32 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-[128px] mix-blend-screen" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/30 rounded-full blur-[128px] mix-blend-screen" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 text-primary font-medium text-xs md:text-sm border border-primary/20 mb-2">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            Join the Planora Community
          </div>
          
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[1.1]">
            Ready to Make <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Memories Happen?
            </span>
          </h2>
          
          <p className="text-base md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Whether you're looking to host the next big tech conference or just want to find a local cooking class, Planora is your platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 md:pt-8">
            <Button size="lg" className="w-full sm:w-auto h-12 md:h-14 px-8 text-base md:text-lg rounded-full group shadow-xl shadow-primary/25" asChild>
              <Link href="/register">
                Get Started for Free
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 md:h-14 px-8 text-base md:text-lg rounded-full" asChild>
              <Link href="/events">Explore Events</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
