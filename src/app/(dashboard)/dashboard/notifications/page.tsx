import NotificationsClient from "@/components/modules/Dashboard/Notifications/NotificationsClient";

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground mt-2">Stay updated with event invitations, join requests, and platform alerts.</p>
      </div>
      <NotificationsClient />
    </div>
  );
}
