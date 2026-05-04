import FeaturedEvents from "./FeaturedEvents";

async function getFeaturedEvents() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events?limit=6&isFeatured=true`, {
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) return null;
    const data = await res.json();
    
    if (data.data?.events?.length === 0) {
        const recentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events?limit=6`, {
            next: { revalidate: 3600 },
        });
        if (!recentRes.ok) return null;
        const recentData = await recentRes.json();
        return recentData.data;
    }
    
    return data.data;
  } catch (error) {
    console.error("Failed to fetch featured events:", error);
    return null;
  }
}

export default async function FeaturedEventsWrapper() {
  const events = await getFeaturedEvents();
  return <FeaturedEvents initialData={events} />;
}
