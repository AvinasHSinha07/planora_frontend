export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
      <p className="text-muted-foreground">View and manage reviews for your hosted events.</p>
      <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground shadow-sm">
        No reviews available yet.
      </div>
    </div>
  );
}
