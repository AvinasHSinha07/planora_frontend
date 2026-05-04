export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
      <p className="text-muted-foreground">Your recent activity and alerts.</p>
      <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground shadow-sm">
        You have no new notifications.
      </div>
    </div>
  );
}
