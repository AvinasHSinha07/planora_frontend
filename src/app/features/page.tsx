import { Metadata } from "next";
import Image from "next/image";
import { 
  Zap, 
  Target, 
  BarChart3, 
  Users2, 
  ShieldCheck, 
  Smartphone,
  Globe2,
  Cpu,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features | Planora - Professional Event Management",
  description: "Explore the powerful tools we built to help you create stunning events.",
};

const featureList = [
  {
    title: "Instant Creation",
    description: "Launch in minutes with our drag-and-drop builder.",
    icon: Zap,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Smart Invites",
    description: "Automated sequences that drive attendance.",
    icon: Target,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Real-time Data",
    description: "Live tracking of every ticket and interaction.",
    icon: BarChart3,
    color: "text-brand-pink",
    bg: "bg-brand-pink/10"
  },
  {
    title: "Scale Support",
    description: "Manage 10 or 10,000 attendees effortlessly.",
    icon: Users2,
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    title: "Safe & Secure",
    description: "Enterprise-grade security via Stripe.",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Mobile First",
    description: "Flawless experience on every screen size.",
    icon: Smartphone,
    color: "text-brand-yellow",
    bg: "bg-brand-yellow/10"
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-black tracking-widest uppercase">
              <Cpu className="w-3 h-3" /> System Capabilities
           </div>
           <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none uppercase">
              Precision <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Engineering.</span>
           </h1>
           <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed italic">
              Planora is more than a platform; it's a high-performance engine for the next generation of event organizers.
           </p>
        </div>
      </section>

      {/* Main Feature Showcase */}
      <section className="py-24 space-y-32">
         {/* Feature 1 */}
         <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
               <div className="space-y-8">
                  <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                     <BarChart3 className="w-6 h-6" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">Advanced <br /> Analytics Dashboard</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                     Get a 360-degree view of your event’s performance. From real-time revenue tracking to attendee demographic heatmaps, we provide the data you need to make informed decisions.
                  </p>
                  <ul className="space-y-4">
                     {["Live Ticket Sales Tracking", "Revenue Forecasting", "Attendee Interest Maps"].map(item => (
                       <li key={item} className="flex items-center gap-3 font-bold">
                          <CheckCircle2 className="w-5 h-5 text-primary" /> {item}
                       </li>
                     ))}
                  </ul>
               </div>
               <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border border-border/50 group">
                  <Image 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070" 
                    alt="Analytics Dashboard"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
               </div>
            </div>
         </div>

         {/* Feature 2 */}
         <div className="bg-muted/30 py-32 border-y">
            <div className="container mx-auto px-4">
               <div className="grid lg:grid-cols-2 gap-24 items-center">
                  <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border border-border/50 group order-2 lg:order-1">
                     <Image 
                       src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070" 
                       alt="Mobile Experience"
                       fill
                       className="object-cover group-hover:scale-105 transition-transform duration-1000"
                     />
                  </div>
                  <div className="space-y-8 order-1 lg:order-2">
                     <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-white shadow-xl shadow-secondary/20">
                        <Smartphone className="w-6 h-6" />
                     </div>
                     <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">Attendee <br /> Mobile Hub</h2>
                     <p className="text-lg text-muted-foreground leading-relaxed">
                        Provide your attendees with a seamless, native-feeling experience on any device. Digital tickets, real-time schedule updates, and interactive venue maps—all without an app download.
                     </p>
                     <ul className="space-y-4">
                        {["Wallet Integrated Tickets", "Interactive Schedules", "Real-time Notifications"].map(item => (
                          <li key={item} className="flex items-center gap-3 font-bold">
                             <CheckCircle2 className="w-5 h-5 text-secondary" /> {item}
                          </li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>
         </div>

         {/* Feature 3 */}
         <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
               <div className="space-y-8">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                     <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">Secure <br /> Payment Gateway</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                     Enterprise-grade security is built into every transaction. Integrated with Stripe, we support 100+ currencies and multiple payment methods, ensuring your revenue is safe and accessible.
                  </p>
                  <ul className="space-y-4">
                     {["Stripe Enterprise Security", "Multi-currency Support", "Instant Payout Options"].map(item => (
                       <li key={item} className="flex items-center gap-3 font-bold">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {item}
                       </li>
                     ))}
                  </ul>
               </div>
               <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border border-border/50 group">
                  <Image 
                    src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070" 
                    alt="Secure Payments"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
               </div>
            </div>
         </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32">
         <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
               <h2 className="text-4xl font-black tracking-tight uppercase">Everything else you need</h2>
               <p className="text-muted-foreground text-lg">A comprehensive toolkit for modern organizers.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {featureList.map((f) => (
                 <div key={f.title} className="p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/50 hover:shadow-2xl transition-all duration-500 group">
                    <div className={`h-14 w-14 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                       <f.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{f.description}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
         <div className="container mx-auto px-4 text-center space-y-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">Start building <br /> for impact today.</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Button size="lg" className="rounded-full h-16 px-10 text-xl font-black uppercase tracking-tight" asChild>
                  <Link href="/register">Get Started Now</Link>
               </Button>
               <Button size="lg" variant="outline" className="rounded-full h-16 px-10 text-xl font-black uppercase tracking-tight" asChild>
                  <Link href="/contact">Talk to Sales</Link>
               </Button>
            </div>
         </div>
      </section>
    </div>
  );
}
