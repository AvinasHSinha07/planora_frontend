"use client";

import { motion } from "framer-motion";
import { UserPlus, Search, Ticket, CalendarCheck } from "lucide-react";

const steps = [
  {
    icon: <UserPlus className="w-8 h-8" />,
    title: "Create an Account",
    description: "Sign up in seconds and complete your profile to get personalized event recommendations.",
  },
  {
    icon: <Search className="w-8 h-8" />,
    title: "Discover Events",
    description: "Browse through hundreds of events, filter by your interests, or search for specific organizers.",
  },
  {
    icon: <Ticket className="w-8 h-8" />,
    title: "Get Your Tickets",
    description: "Register for free events instantly or securely purchase tickets for premium experiences.",
  },
  {
    icon: <CalendarCheck className="w-8 h-8" />,
    title: "Attend & Enjoy",
    description: "Join the event, network with participants, and leave a review afterwards.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your journey to unforgettable experiences starts here. Simple, fast, and secure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative p-6 rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 -right-4 w-8 h-[2px] bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
