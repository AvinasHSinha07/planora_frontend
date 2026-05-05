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
    <div className="min-h-screen pb-16 md:pb-24">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 pb-12 md:pb-16 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-brand-pink/10 to-transparent blur-3xl -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.1]">
            Plans built for <br className="xs:hidden" /> <span className="text-primary italic">every</span> creator.
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Choose the perfect plan to power your events. No hidden fees, cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative flex flex-col p-6 md:p-8 rounded-[2rem] border transition-all duration-300 hover:shadow-2xl ${
                plan.highlight 
                  ? "bg-card border-primary shadow-xl md:scale-105 z-10" 
                  : "bg-background border-border"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                  Most Popular
                </div>
              )}
              <div className="mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{plan.description}</p>
              </div>
              <div className="mb-6 md:mb-8 flex items-baseline gap-1">
                <span className="text-3xl md:text-5xl font-black">{plan.price === "Custom" ? "" : "$"}</span>
                <span className="text-4xl md:text-6xl font-black tracking-tight">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-muted-foreground font-medium text-sm md:text-base">/mo</span>}
              </div>
              <ul className="space-y-3 md:space-y-4 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-xs md:text-sm">
                    <Check className="h-4 w-4 md:h-5 md:w-5 text-emerald-500 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                asChild 
                variant={plan.highlight ? "default" : "outline"} 
                className="w-full h-11 md:h-12 rounded-xl text-sm md:text-base font-bold shadow-lg shadow-primary/10"
              >
                <Link href={plan.link}>
                  {plan.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-4 mt-20 md:mt-32 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 md:mb-16">Trusted by world-class organizers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 opacity-50 grayscale px-4">
          <div className="flex items-center justify-center font-black text-lg md:text-2xl tracking-tighter italic">TECHCON</div>
          <div className="flex items-center justify-center font-black text-lg md:text-2xl tracking-tighter">GLOBAL HUB</div>
          <div className="flex items-center justify-center font-black text-lg md:text-2xl tracking-tighter italic">STARTUP WEEK</div>
          <div className="flex items-center justify-center font-black text-lg md:text-2xl tracking-tighter">DESIGN FEST</div>
        </div>
      </section>
    </div>
  );
}
