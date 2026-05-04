import EventsPageClient from "@/components/modules/Events/EventsPageClient";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <EventsPageClient />
      </main>
      <Footer />
    </div>
  );
}
