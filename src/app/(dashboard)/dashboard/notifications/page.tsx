import NotificationsClient from "@/components/modules/Dashboard/Notifications/NotificationsClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground mt-2">Stay updated with event invitations, join requests, and platform alerts.</p>
      </div>
      <Suspense fallback={
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <NotificationsClient />
      </Suspense>
    </div>
  );
}
