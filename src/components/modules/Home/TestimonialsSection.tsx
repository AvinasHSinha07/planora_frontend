"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Event Organizer",
    content: "Planora has completely transformed how I manage my tech conferences. The dynamic features and seamless ticketing are a lifesaver.",
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "Attendee",
    content: "The easiest platform I've ever used to discover local music festivals. The UI is absolutely stunning and payments are instant.",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Community Manager",
    content: "We moved all our community workshops to Planora. The built-in AI assistant helps us tag and categorize our events automatically!",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Loved by Our Community</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
            See what our community has to say about the Planora experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-background border-none shadow-xl rounded-[1.5rem] md:rounded-[2rem] hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-6 md:p-8">
                <div className="flex gap-1 text-yellow-500 mb-4 md:mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 md:h-5 md:w-5 fill-current" />
                  ))}
                </div>
                <p className="text-base md:text-lg leading-relaxed text-foreground mb-6 md:mb-8 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4 border-t pt-6">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm md:text-base">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm md:text-base">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
