"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterSection() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Subscribed successfully! Keep an eye on your inbox.");
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-card border rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-16 shadow-xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary" />
          
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 text-primary mb-6">
            <Mail className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          
          <h2 className="text-2xl md:text-5xl font-black mb-4">Never Miss an Event</h2>
          <p className="text-sm md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto px-4">
            Subscribe to our newsletter to receive weekly updates on top events, exclusive discounts, and organizer tips.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              required
              className="h-12 rounded-xl bg-muted/50 border-none"
            />
            <Button type="submit" size="lg" className="h-12 rounded-xl px-8 font-bold shadow-lg shadow-primary/20">
              Subscribe
            </Button>
          </form>
          <p className="text-[10px] md:text-xs text-muted-foreground mt-6 uppercase tracking-widest font-medium">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
