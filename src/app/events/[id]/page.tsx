import EventDetailsClient from "@/components/modules/Events/EventDetailsClient";
import { Metadata } from "next";
import { Suspense } from "react";

async function getEvent(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
      cache: "no-store",
    });
    
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(`Failed to fetch event ${id}:`, error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return {
      title: "Event Not Found - Planora",
      description: "The requested event could not be found.",
    };
  }

  return {
    title: `${event.title} - Planora`,
    description: event.description.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 160),
      images: [event.bannerImage || ""],
    },
  };
}

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <Suspense fallback={
          <div className="container mx-auto py-24 flex flex-col items-center gap-4 animate-pulse">
            <div className="h-12 w-1/3 bg-muted rounded-full" />
            <div className="h-[400px] w-full bg-muted rounded-3xl" />
          </div>
        }>
          <EventDetailsClient initialData={event} />
        </Suspense>
      </main>
    </div>
  );
}
