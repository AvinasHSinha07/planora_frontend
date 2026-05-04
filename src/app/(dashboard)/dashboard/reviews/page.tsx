import { Metadata } from "next";
import ReviewsClient from "@/components/modules/Dashboard/Reviews/ReviewsClient";

export const metadata: Metadata = {
  title: "Event Reviews | Planora Dashboard",
  description: "View feedback and ratings from your event attendees.",
};

export default function ReviewsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground mt-2">View and manage feedback for your hosted events.</p>
      </div>
      <ReviewsClient />
    </div>
  );
}
