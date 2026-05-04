import { Metadata } from "next";
import AnalyticsDashboard from "@/components/modules/Dashboard/Analytics/AnalyticsDashboard";
import CustomerAnalytics from "@/components/modules/Dashboard/Analytics/CustomerAnalytics";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Analytics | Planora Dashboard",
  description: "Track your event performance and revenue",
};

export default async function AnalyticsPage() {
  // Fetch session server-side to determine role
  const sessionResponse = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  const userRole = (sessionResponse?.data?.user as any)?.role || "USER";

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        {userRole === "USER" ? <CustomerAnalytics /> : <AnalyticsDashboard />}
      </Suspense>
    </div>
  );
}
