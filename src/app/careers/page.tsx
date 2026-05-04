import { Metadata } from "next";
import Image from "next/image";
import { Briefcase, MapPin, Clock, ArrowUpRight, Globe, Zap, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers | Planora",
  description: "Join the team building the future of event management.",
};

const jobs = [
  { title: "Senior Frontend Engineer", team: "Engineering", type: "Full-time", location: "Remote / SF" },
  { title: "Product Designer", team: "Design", type: "Full-time", location: "Remote / NY" },
  { title: "Growth Marketing Manager", team: "Marketing", type: "Full-time", location: "London" },
  { title: "Customer Success Lead", team: "Operations", type: "Full-time", location: "Remote" },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-black tracking-widest uppercase">
              <Star className="w-3 h-3" /> We're Hiring
           </div>
           <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none uppercase">
              Design the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient-text">Future.</span>
           </h1>
           <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed italic">
              Planora is a mission-driven team of creators, engineers, and dreamers building the infrastructure for human connection.
           </p>
           <Button size="lg" className="rounded-full h-16 px-10 text-xl font-black uppercase tracking-tight shadow-2xl shadow-primary/20" asChild>
              <Link href="#jobs">View Openings</Link>
           </Button>
        </div>
      </section>

      {/* Visual Section */}
      <section className="container mx-auto px-4 pb-32">
         <div className="grid md:grid-cols-2 gap-8 h-[600px]">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl group">
               <Image 
                 src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070" 
                 alt="Our Team"
                 fill
                 className="object-cover group-hover:scale-105 transition-transform duration-1000"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
               <div className="absolute bottom-10 left-10 text-white">
                  <h3 className="text-3xl font-black uppercase italic">Collaborative by Nature</h3>
               </div>
            </div>
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl group">
               <Image 
                 src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070" 
                 alt="Remote Culture"
                 fill
                 className="object-cover group-hover:scale-105 transition-transform duration-1000"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
               <div className="absolute bottom-10 left-10 text-white">
                  <h3 className="text-3xl font-black uppercase italic">Remote-First Culture</h3>
               </div>
            </div>
         </div>
      </section>

      {/* Why Join Us */}
      <section className="py-32 bg-muted/30 border-y">
         <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
               <h2 className="text-4xl font-black tracking-tight uppercase">Why Planora?</h2>
               <p className="text-muted-foreground text-lg">We invest in our people so they can invest in the future.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
               {[
                 { icon: Globe, title: "Remote-First", desc: "Work from anywhere in the world, on your own terms." },
                 { icon: Zap, title: "Impact Driven", desc: "Your work directly affects millions of attendees every month." },
                 { icon: Heart, title: "Health & Wellness", desc: "Comprehensive insurance and wellness stipends for all." },
                 { icon: Star, title: "Equity & Ownership", desc: "Every employee is an owner with a stake in our success." }
               ].map((perk) => (
                 <div key={perk.title} className="text-center space-y-6 group">
                    <div className="h-16 w-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-white transition-all duration-500">
                       <perk.icon className="h-8 w-8" />
                    </div>
                    <h4 className="text-2xl font-black uppercase italic">{perk.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{perk.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Open Positions */}
      <section id="jobs" className="py-32">
         <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
               <div className="space-y-4">
                  <h2 className="text-5xl md:text-7xl font-black tracking-tight uppercase leading-none">Open <br /> Opportunities</h2>
                  <p className="text-muted-foreground text-lg">Find your next big challenge.</p>
               </div>
               <div className="flex gap-4">
                  <div className="px-6 py-2 rounded-full border border-border font-bold">4 Open Roles</div>
               </div>
            </div>

            <div className="grid gap-6">
               {jobs.map((job) => (
                 <Link 
                   key={job.title} 
                   href="#" 
                   className="group p-10 rounded-[3rem] bg-card border border-border/50 hover:border-primary/50 hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-8"
                 >
                   <div className="space-y-4">
                      <h3 className="text-3xl font-black uppercase italic group-hover:text-primary transition-colors">{job.title}</h3>
                      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground font-bold tracking-widest uppercase">
                         <span className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" /> {job.team}
                         </span>
                         <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> {job.location}
                         </span>
                         <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" /> {job.type}
                         </span>
                      </div>
                   </div>
                   <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <ArrowUpRight className="h-8 w-8" />
                   </div>
                 </Link>
               ))}
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
         <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto rounded-[4rem] bg-secondary p-16 md:p-24 space-y-8">
               <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic">Don't see a fit?</h2>
               <p className="text-white/80 text-xl font-medium leading-relaxed italic">
                  We're always looking for exceptional talent. If you're passionate about gatherings, reach out anyway.
               </p>
               <Button size="lg" className="bg-white text-secondary hover:bg-white/90 rounded-full h-16 px-10 text-xl font-black uppercase tracking-tight" asChild>
                  <Link href="/contact">General Application</Link>
               </Button>
            </div>
         </div>
      </section>
    </div>
  );
}
