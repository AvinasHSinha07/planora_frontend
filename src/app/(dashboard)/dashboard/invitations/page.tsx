import InvitationsClient from "@/components/modules/Dashboard/Invitations/InvitationsClient";

export default function InvitationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invitations</h1>
        <p className="text-muted-foreground mt-2">Manage your private event invitations and responses.</p>
      </div>
      <InvitationsClient />
    </div>
  );
}
