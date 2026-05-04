import UpcomingEventsSlider from "./UpcomingEventsSlider";

async function getUpcomingEvents() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events?type=PUBLIC_FREE,PUBLIC_PAID&limit=6`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.events || [];
  } catch (error) {
    console.error("Failed to fetch upcoming events:", error);
    return [];
  }
}

export default async function UpcomingEventsWrapper() {
  const events = await getUpcomingEvents();
  return <UpcomingEventsSlider initialData={events} />;
}
