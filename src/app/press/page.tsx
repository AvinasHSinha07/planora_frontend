import { Metadata } from "next";
import { Download, ExternalLink, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Press | Planora",
  description: "Brand assets, press releases, and media contact information.",
};

const news = [
  { date: "Oct 12, 2024", title: "Planora Raises $15M Series A to Expand Global Reach", source: "TechCrunch" },
  { date: "Aug 05, 2024", title: "The Future of Hybrid Events: Why Planora is Leading the Way", source: "Forbes" },
  { date: "Jun 15, 2024", title: "Planora Named 'App of the Day' by Design Society", source: "The Verge" },
];

export default function PressPage() {
  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            Press <span className="text-primary italic">Center</span>.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Our latest news, brand assets, and media resources for journalists and creators.
          </p>
        </div>
      </section>

      {/* Assets */}
      <section className="max-w-4xl mx-auto px-4 py-16">
         <div className="bg-card border border-border p-8 rounded-3xl grid md:grid-cols-2 gap-12 items-center shadow-xl">
            <div className="space-y-6">
               <h2 className="text-3xl font-bold">Brand Identity</h2>
               <p className="text-muted-foreground leading-relaxed">Download our logos, colors, and typography guidelines for consistent brand usage.</p>
               <Button className="rounded-xl h-12 px-6 font-bold flex gap-2">
                  <Download className="h-4 w-4" /> Download Kit (12MB)
               </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="aspect-square bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-2xl tracking-tighter">P</div>
               <div className="aspect-square bg-muted rounded-2xl border border-border" />
               <div className="aspect-square bg-muted rounded-2xl border border-border" />
               <div className="aspect-square bg-gradient-to-br from-brand-pink to-brand-yellow rounded-2xl" />
            </div>
         </div>
      </section>

      {/* News */}
      <section className="max-w-4xl mx-auto px-4 py-24">
         <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Latest News</h2>
            <Button variant="ghost" className="font-bold">View Archive</Button>
         </div>

         <div className="space-y-6">
            {news.map((item) => (
               <div key={item.title} className="group p-6 border-b border-border hover:bg-muted/30 transition-all rounded-xl flex items-center justify-between gap-6">
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                        <Newspaper className="h-3 w-3" /> {item.source} • {item.date}
                     </div>
                     <h3 className="text-xl font-bold leading-tight group-hover:underline cursor-pointer">{item.title}</h3>
                  </div>
                  <ExternalLink className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
            ))}
         </div>
      </section>
    </div>
  );
}
