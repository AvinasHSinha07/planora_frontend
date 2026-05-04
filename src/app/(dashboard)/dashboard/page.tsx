import DashboardOverview from "@/components/modules/Dashboard/DashboardOverview";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
      <Suspense fallback={
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <DashboardOverview />
      </Suspense>
    </div>
  );
}
