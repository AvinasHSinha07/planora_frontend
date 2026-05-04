import EventDetailsClient from "@/components/modules/Events/EventDetailsClient";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function EventDetailsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <EventDetailsClient />
      </main>
      <Footer />
    </div>
  );
}
