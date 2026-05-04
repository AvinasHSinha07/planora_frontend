import { Metadata } from "next";
import { Check, ArrowRight, Star, Zap, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing | Planora - Premium Event Management",
  description: "Simple, transparent pricing for event organizers of all sizes.",
};

const plans = [
  {
    name: "Starter",
    price: "0",
    description: "Perfect for small meetups and community gatherings.",
    features: [
      "Up to 3 active events",
      "Standard registration form",
      "Email support",
      "Public event listing",
      "Community forum access",
    ],
    buttonText: "Start for Free",
    link: "/register?plan=starter",
    highlight: false,
  },
  {
    name: "Pro",
    price: "49",
    description: "Ideal for professional organizers and growing startups.",
    features: [
      "Unlimited active events",
      "Custom registration forms",
      "Priority email & chat support",
      "Advanced analytics dashboard",
      "Custom branding & themes",
      "Discount code management",
    ],
    buttonText: "Get Started",
    link: "/register?plan=pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Robust tools and dedicated support for large organizations.",
    features: [
      "Dedicated account manager",
      "White-label solution",
      "API access & integrations",
      "SSO & advanced security",
      "Custom contract & invoicing",
      "On-site event support",
    ],
    buttonText: "Contact Sales",
    link: "/contact",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-brand-pink/10 to-transparent blur-3xl -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            Plans built for <span className="text-primary italic">every</span> creator.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan to power your events. No hidden fees, cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all hover:shadow-2xl hover:-translate-y-1 ${
                plan.highlight 
                  ? "bg-card border-primary shadow-xl scale-105 z-10" 
                  : "bg-background border-border"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{plan.description}</p>
              </div>
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-black">{plan.price === "Custom" ? "" : "$"}</span>
                <span className="text-6xl font-black tracking-tight">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-muted-foreground font-medium">/mo</span>}
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                asChild 
                variant={plan.highlight ? "default" : "outline"} 
                className="w-full h-12 rounded-xl text-base font-bold"
              >
                <Link href={plan.link}>
                  {plan.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-4 mt-32 text-center">
        <h2 className="text-3xl font-bold mb-16">Trusted by world-class organizers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 opacity-50 grayscale">
          <div className="flex items-center justify-center font-black text-2xl tracking-tighter italic">TECHCON</div>
          <div className="flex items-center justify-center font-black text-2xl tracking-tighter">GLOBAL HUB</div>
          <div className="flex items-center justify-center font-black text-2xl tracking-tighter italic">STARTUP WEEK</div>
          <div className="flex items-center justify-center font-black text-2xl tracking-tighter">DESIGN FEST</div>
        </div>
      </section>
    </div>
  );
}
