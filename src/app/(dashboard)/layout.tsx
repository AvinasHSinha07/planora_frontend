import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import DashboardSidebar from "@/components/modules/Dashboard/DashboardSidebar";
import { authClient } from "@/lib/auth-client";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Server-side session check
  const sessionResponse = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  const session = sessionResponse?.data;
  
  if (!session) {
    console.log("[DASHBOARD] No session found, redirecting to login...");
    redirect("/login");
  }

  const userRole = (session.user as any)?.role;
  console.log(`[DASHBOARD] User ${session.user.email} (${userRole}) authorized.`);

  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Sidebar: Fixed height and sticky to the viewport */}
      <aside className="w-64 border-r bg-card hidden md:block flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-4">
          <DashboardSidebar />
        </div>
      </aside>

      {/* Main Content: Natural flow with browser scrollbar */}
      <main className="flex-1 min-w-0 p-4 md:p-10">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
