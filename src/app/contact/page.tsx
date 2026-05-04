import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-24 container mx-auto px-4 max-w-xl">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Contact Us</h1>
        <p className="text-center text-muted-foreground mb-10">We'd love to hear from you. Drop us a line.</p>
        
        <form className="space-y-6 bg-card p-8 rounded-2xl border shadow-xl">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input placeholder="Your Name" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <textarea 
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[150px]"
              placeholder="How can we help you?"
            ></textarea>
          </div>
          <Button className="w-full h-12 text-md">Send Message</Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
