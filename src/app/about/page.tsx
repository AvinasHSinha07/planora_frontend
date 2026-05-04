import { Metadata } from "next";
import Image from "next/image";
import { Heart, Users, Sparkles, Rocket, ShieldCheck, Globe, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Planora",
  description: "Learn about the mission and team behind the world's most modern event management platform.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold tracking-wide animate-fade-in">
               <Sparkles className="w-4 h-4" /> THE PLANORA STORY
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
              Elevating the world’s <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient-text italic">human connections.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Planora was founded with a singular vision: to bridge the gap between digital efficiency and the raw energy of live experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Break */}
      <section className="container mx-auto px-4 pb-24">
        <div className="relative h-[500px] md:h-[700px] w-full rounded-[3rem] overflow-hidden shadow-2xl group">
          <Image 
            src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012" 
            alt="Vibrant Event Experience"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-1000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row items-end justify-between gap-8">
             <div className="space-y-2">
                <p className="text-white/60 font-mono text-sm tracking-[0.3em] uppercase">Est. 2024</p>
                <h2 className="text-4xl font-bold text-white max-w-md">Built for organizers who dare to dream bigger.</h2>
             </div>
             <div className="flex gap-4">
                <div className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold">
                   10M+ Attendees
                </div>
                <div className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold">
                   50K+ Global Events
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
             <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight">Our Mission is <br /> <span className="text-primary italic">Gathering.</span></h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                   In a world that's increasingly digital, we believe that physical and hybrid gatherings are more important than ever. 
                   Human connection is the heartbeat of progress, and we are here to provide the digital pulse.
                </p>
                <div className="grid gap-6">
                   <div className="flex gap-4 items-start">
                      <div className="mt-1 h-10 w-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                         <ShieldCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                         <h4 className="font-bold text-xl">Radical Integrity</h4>
                         <p className="text-muted-foreground">Every ticket, every transaction, and every data point is handled with uncompromising transparency.</p>
                      </div>
                   </div>
                   <div className="flex gap-4 items-start">
                      <div className="mt-1 h-10 w-10 rounded-xl bg-secondary flex items-center justify-center shrink-0 shadow-lg shadow-secondary/20">
                         <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                         <h4 className="font-bold text-xl">Hyper-Efficiency</h4>
                         <p className="text-muted-foreground">We eliminate the friction of event management, allowing creators to focus on the magic, not the logistics.</p>
                      </div>
                   </div>
                </div>
             </div>
             <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl">
                <Image 
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069" 
                  alt="Team Collaboration"
                  fill
                  className="object-cover"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
             <h2 className="text-4xl font-black tracking-tight uppercase">Core Principles</h2>
             <p className="text-muted-foreground text-lg italic">The DNA of every feature we ship.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Empathy First", desc: "We build for the people, not for the algorithms.", icon: Heart, color: "bg-red-500/10 text-red-500" },
              { title: "Excellence", desc: "Good enough is the enemy of the extraordinary.", icon: Sparkles, color: "bg-amber-500/10 text-amber-500" },
              { title: "Global Reach", desc: "Borderless events for a borderless world.", icon: Globe, color: "bg-blue-500/10 text-blue-500" },
              { title: "Community", desc: "We thrive only when our organizers thrive.", icon: Users, color: "bg-emerald-500/10 text-emerald-500" },
            ].map((value) => (
              <div key={value.title} className="p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/50 hover:shadow-2xl transition-all duration-500 group">
                <div className={`h-14 w-14 rounded-2xl ${value.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
         <div className="max-w-7xl mx-auto rounded-[4rem] bg-primary relative overflow-hidden p-12 md:p-24 text-center">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
               <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[100px]" />
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-black rounded-full blur-[100px]" />
            </div>
            
            <div className="relative z-10 space-y-8">
               <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Ready to join the <br /> next generation?</h2>
               <p className="text-white/80 text-xl max-w-2xl mx-auto leading-relaxed font-medium italic">
                  Whether you're a creator, an organizer, or a seeker of experiences, there's a place for you in the Planora ecosystem.
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full h-16 px-10 text-xl font-black transition-all hover:scale-105" asChild>
                     <Link href="/register">Start Organizing <ArrowRight className="ml-2 w-6 h-6" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full h-16 px-10 text-xl font-black backdrop-blur-sm" asChild>
                     <Link href="/events">Browse Experiences</Link>
                  </Button>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
