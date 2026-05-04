import { Metadata } from "next";
import { Heart, Users, Sparkles, Rocket } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Planora",
  description: "Learn about the mission and team behind the world's most modern event management platform.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            We believe in the power of <span className="text-primary italic">gathering</span>.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Planora was founded in 2024 with a simple goal: to make professional event management accessible, beautiful, and efficient for everyone.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              In a world that's increasingly digital, we believe that physical and hybrid gatherings are more important than ever. 
              Our mission is to provide the digital tools that empower these human connections.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <h4 className="text-3xl font-black text-primary italic">10M+</h4>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Attendees Moved</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-3xl font-black text-primary italic">50K+</h4>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Global Events</p>
              </div>
            </div>
          </div>
          <div className="aspect-video bg-gradient-to-br from-brand-pink/20 to-brand-yellow/20 rounded-3xl overflow-hidden relative group">
             {/* Mock Team Image Placeholder */}
             <div className="absolute inset-0 flex items-center justify-center">
                <Users className="h-24 w-24 text-primary opacity-20 group-hover:scale-110 transition-transform duration-500" />
             </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-card border-y py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Our Core Values</h2>
            <p className="text-muted-foreground">What drives us every single day.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "Empathy First", desc: "We build for the people who use our platform.", icon: Heart },
              { title: "Excellence", desc: "Good enough is never enough.", icon: Sparkles },
              { title: "Speed", desc: "Move fast, iterate constantly.", icon: Rocket },
              { title: "Community", desc: "We thrive when our organizers thrive.", icon: Users },
            ].map((value) => (
              <div key={value.title} className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
