import SettingsClient from "@/components/modules/Dashboard/Settings/SettingsClient";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account preferences, profile, and security settings.</p>
      </div>
      <SettingsClient />
    </div>
  );
}
