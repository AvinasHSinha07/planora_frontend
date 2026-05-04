import { Metadata } from "next";
import AnalyticsDashboard from "@/components/modules/Dashboard/Analytics/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics | Planora Dashboard",
  description: "Track your event performance and revenue",
};

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <AnalyticsDashboard />
    </Suspense>
  );
}
