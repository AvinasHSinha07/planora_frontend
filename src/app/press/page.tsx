import { Metadata } from "next";
import Image from "next/image";
import { Download, ExternalLink, Newspaper, Share2, Mail, Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Press | Planora",
  description: "Brand assets, press releases, and media contact information.",
};

const news = [
  { date: "Oct 12, 2024", title: "Planora Raises $15M Series A to Expand Global Reach", source: "TechCrunch", link: "#" },
  { date: "Aug 05, 2024", title: "The Future of Hybrid Events: Why Planora is Leading the Way", source: "Forbes", link: "#" },
  { date: "Jun 15, 2024", title: "Planora Named 'App of the Day' by Design Society", source: "The Verge", link: "#" },
];

export default function PressPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 space-y-8">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-black tracking-widest uppercase">
              <Newspaper className="w-3 h-3" /> Press Center
           </div>
           <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none uppercase">
              Latest <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">Insights.</span>
           </h1>
           <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed italic">
              Resources for journalists, creators, and partners to tell the Planora story.
           </p>
        </div>
      </section>

      {/* Brand Identity Section */}
      <section className="py-24 bg-muted/30 border-y">
         <div className="container mx-auto px-4">
            <div className="bg-card border border-border/50 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
               <div className="p-12 lg:p-24 space-y-8 lg:w-1/2">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-none">Brand Identity & Assets</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                     Download our high-resolution logos, brand guidelines, and official imagery for use in your coverage.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                     <Button className="rounded-full h-16 px-8 text-lg font-black uppercase tracking-tight gap-2">
                        <Download className="w-5 h-5" /> Download Media Kit (45MB)
                     </Button>
                     <Button variant="outline" className="rounded-full h-16 px-8 text-lg font-black uppercase tracking-tight gap-2">
                        Guidelines PDF
                     </Button>
                  </div>
               </div>
               <div className="lg:w-1/2 relative bg-primary/5 flex items-center justify-center p-12">
                  <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                     <div className="aspect-square rounded-3xl bg-primary flex items-center justify-center text-white text-6xl font-black shadow-2xl shadow-primary/20 animate-pulse">P</div>
                     <div className="aspect-square rounded-3xl bg-white border border-border flex items-center justify-center text-primary text-6xl font-black shadow-xl">P</div>
                     <div className="aspect-square rounded-3xl bg-secondary flex items-center justify-center text-white text-6xl font-black shadow-2xl shadow-secondary/20">P</div>
                     <div className="aspect-square rounded-3xl bg-black flex items-center justify-center text-white text-6xl font-black shadow-xl">P</div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* News Feed */}
      <section className="py-32">
         <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
               <div className="space-y-4">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-none">In the News</h2>
                  <p className="text-muted-foreground text-lg italic">Coverage from leading global publications.</p>
               </div>
               <Button variant="ghost" className="font-black uppercase tracking-widest text-primary flex gap-2">
                  View Archive <ArrowRight className="w-4 h-4" />
               </Button>
            </div>

            <div className="space-y-4">
               {news.map((item) => (
                 <Link 
                   key={item.title} 
                   href={item.link} 
                   className="group p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/50 hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-8"
                 >
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 text-xs font-black tracking-widest uppercase text-primary">
                         <span className="px-3 py-1 rounded-full bg-primary/10">{item.source}</span>
                         <span className="text-muted-foreground">/</span>
                         <span className="text-muted-foreground">{item.date}</span>
                      </div>
                      <h3 className="text-3xl font-black uppercase italic group-hover:text-primary transition-colors leading-tight max-w-2xl">
                         "{item.title}"
                      </h3>
                   </div>
                   <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <ExternalLink className="h-8 w-8" />
                   </div>
                 </Link>
               ))}
            </div>
         </div>
      </section>

      {/* Media Contact */}
      <section className="py-24">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
               <div className="p-12 rounded-[3rem] bg-card border border-border/50 space-y-6">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                     <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-black uppercase italic">Media Inquiries</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                     For interview requests, brand partnerships, or general media questions, please contact our team.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-xl font-black text-primary hover:text-primary/80">
                     press@planora.com
                  </Button>
               </div>
               <div className="p-12 rounded-[3rem] bg-card border border-border/50 space-y-6">
                  <div className="h-12 w-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                     <Share2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-black uppercase italic">Stay Connected</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                     Follow our official channels for real-time updates and announcements from the Planora team.
                  </p>
                  <div className="flex gap-4">
                     {["Twitter", "LinkedIn", "Instagram"].map(social => (
                       <Link key={social} href="#" className="font-bold hover:text-primary transition-colors uppercase tracking-widest text-xs">{social}</Link>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
