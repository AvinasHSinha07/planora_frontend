import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-24 container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-extrabold mb-6">About Planora</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Planora is the definitive platform for discovering, managing, and experiencing world-class events. 
            Born from the architecture of highly successful enterprise marketplaces, Planora provides organizers 
            with the tools they need to host seamless public or private events, while offering attendees a frictionless 
            way to explore, RSVP, and engage.
          </p>
          <div className="my-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-card border rounded-2xl shadow-sm">
              <h3 className="font-bold text-xl text-primary mb-2">Innovation</h3>
              <p className="text-sm text-muted-foreground">Powered by AI and modern web architecture.</p>
            </div>
            <div className="p-6 bg-card border rounded-2xl shadow-sm">
              <h3 className="font-bold text-xl text-primary mb-2">Reliability</h3>
              <p className="text-sm text-muted-foreground">Built to scale for events of thousands.</p>
            </div>
            <div className="p-6 bg-card border rounded-2xl shadow-sm">
              <h3 className="font-bold text-xl text-primary mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">Fostering connections that matter.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
