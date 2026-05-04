import DashboardOverview from "@/components/modules/Dashboard/DashboardOverview";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
      <DashboardOverview />
    </div>
  );
}
