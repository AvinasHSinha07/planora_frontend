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
    <section className="py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Loved by Organizers & Attendees</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what our community has to say about the Planora experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-background border-none shadow-xl">
              <CardContent className="p-8">
                <div className="flex gap-1 text-yellow-500 mb-6">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <p className="text-lg leading-relaxed text-foreground mb-8">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
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
