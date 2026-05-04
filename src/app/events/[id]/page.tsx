import EventDetailsClient from "@/components/modules/Events/EventDetailsClient";

export default function EventDetailsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <EventDetailsClient />
      </main>
    </div>
  );
}
