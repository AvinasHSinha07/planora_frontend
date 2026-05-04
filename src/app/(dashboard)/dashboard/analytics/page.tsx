import { Metadata } from "next";
import AnalyticsDashboard from "@/components/modules/Dashboard/Analytics/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics | Planora Dashboard",
  description: "Track your event performance and revenue",
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
