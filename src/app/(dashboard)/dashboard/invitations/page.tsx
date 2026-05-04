export default function InvitationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Invitations</h1>
      <p className="text-muted-foreground">Manage your event invitations and requests.</p>
      <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground shadow-sm">
        No pending invitations found.
      </div>
    </div>
  );
}
