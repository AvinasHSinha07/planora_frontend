import { Metadata } from "next";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "Contact Us | Planora",
  description: "Get in touch with the Planora team for support, sales, or partnerships.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          {/* Info Side */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                Let's <span className="text-primary italic">Talk</span>.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-md">
                Have a question about our features or pricing? Our team is here to help you build better events.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Email Us</h4>
                  <p className="text-muted-foreground">hello@planora.com</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Call Us</h4>
                  <p className="text-muted-foreground">+1 (555) 000-PLAN</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Visit Us</h4>
                  <p className="text-muted-foreground">123 Event Lane, Creative District, SF</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-card border border-border p-8 md:p-12 rounded-3xl shadow-2xl relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Send className="h-32 w-32 -rotate-12" />
            </div>
            <form className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Name</label>
                  <Input placeholder="John Doe" className="h-12 bg-muted/50 border-none rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                  <Input placeholder="john@example.com" className="h-12 bg-muted/50 border-none rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Subject</label>
                  <Input placeholder="How can we help?" className="h-12 bg-muted/50 border-none rounded-xl" />
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Message</label>
                  <Textarea placeholder="Tell us about your project..." className="min-h-[150px] bg-muted/50 border-none rounded-xl pt-4" />
              </div>
              <Button size="lg" className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
