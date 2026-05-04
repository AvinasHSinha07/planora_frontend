import InvitationsClient from "@/components/modules/Dashboard/Invitations/InvitationsClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function InvitationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invitations</h1>
        <p className="text-muted-foreground mt-2">Manage your private event invitations and responses.</p>
      </div>
      <Suspense fallback={
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <InvitationsClient />
      </Suspense>
    </div>
  );
}
