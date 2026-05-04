import EventsPageClient from "@/components/modules/Events/EventsPageClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const revalidate = 3600; // ISR: 1 hour

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-24 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading elite experiences...</p>
      </div>
    }>
      <EventsPageClient />
    </Suspense>
  );
}
