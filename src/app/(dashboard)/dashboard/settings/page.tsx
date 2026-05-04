export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="text-muted-foreground">Manage your account preferences and profile.</p>
      <div className="bg-card border rounded-xl p-8 shadow-sm max-w-2xl">
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Display Name</label>
            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Your Name" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Preferences</label>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="marketing" className="rounded" />
              <label htmlFor="marketing" className="text-sm text-muted-foreground">Receive marketing emails</label>
            </div>
          </div>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 mt-4">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
