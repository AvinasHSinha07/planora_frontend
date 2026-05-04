import { Metadata } from "next";
import { 
  Zap, 
  Target, 
  BarChart3, 
  Users2, 
  ShieldCheck, 
  Smartphone,
  Globe2,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features | Planora - Professional Event Management",
  description: "Explore the powerful tools we built to help you create stunning events.",
};

const features = [
  {
    title: "Instant Event Creation",
    description: "Launch your event page in minutes with our intuitive, drag-and-drop builder.",
    icon: Zap,
    color: "bg-blue-500",
  },
  {
    title: "Smart Invitations",
    description: "Automated, personalized invitations that drive higher attendance rates.",
    icon: Target,
    color: "bg-purple-500",
  },
  {
    title: "Real-time Analytics",
    description: "Track ticket sales, demographics, and engagement in a beautiful dashboard.",
    icon: BarChart3,
    color: "bg-brand-pink",
  },
  {
    title: "Participant Management",
    description: "Easily manage thousands of attendees with powerful filtering and check-in tools.",
    icon: Users2,
    color: "bg-orange-500",
  },
  {
    title: "Secure Payments",
    description: "Enterprise-grade encryption for all transactions via Stripe integration.",
    icon: ShieldCheck,
    color: "bg-emerald-500",
  },
  {
    title: "Mobile Optimized",
    description: "A flawless experience for your attendees on any device, anywhere.",
    icon: Smartphone,
    color: "bg-brand-yellow",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <Badge variant="outline" className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-background/50 backdrop-blur">
            Powerful Capabilities
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            Built for <span className="text-primary italic">Impact</span>.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From intimate gatherings to massive conferences, Planora provides the infrastructure you need to scale.
          </p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="group p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className={`h-14 w-14 rounded-2xl ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Section */}
      <section className="bg-muted/30 py-32 border-y">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Global Scale, <br />
              <span className="text-primary">Local Reach.</span>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Globe2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Multi-region Support</h4>
                  <p className="text-sm text-muted-foreground">Host events anywhere with localized timezone and currency support.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Cpu className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">AI-Powered Insights</h4>
                  <p className="text-sm text-muted-foreground">Get smart recommendations on how to improve attendee engagement.</p>
                </div>
              </div>
            </div>
            <Button size="lg" className="rounded-xl px-8 h-14 text-lg font-bold">
              Explore Enterprise Solutions
            </Button>
          </div>
          <div className="relative aspect-square bg-gradient-to-br from-brand-pink/20 to-brand-yellow/20 rounded-3xl border border-dashed border-primary/30 flex items-center justify-center p-12">
            <div className="h-full w-full rounded-2xl bg-card shadow-2xl border border-border/50 flex flex-col p-6 space-y-4">
              <div className="h-8 w-1/2 bg-muted rounded animate-pulse" />
              <div className="grid grid-cols-4 gap-4">
                <div className="h-20 bg-primary/5 rounded" />
                <div className="h-20 bg-primary/5 rounded" />
                <div className="h-20 bg-primary/10 rounded border border-primary/20" />
                <div className="h-20 bg-primary/5 rounded" />
              </div>
              <div className="h-32 w-full bg-muted/50 rounded" />
              <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Inline Badge component since it's used
function Badge({ children, variant, className }: any) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
