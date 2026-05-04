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
    <div className="flex min-h-[calc(100vh-64px)] bg-muted/10">
      <div className="container mx-auto flex overflow-hidden pt-4 pb-8 px-4 gap-6">
        <aside className="hidden w-64 md:block flex-shrink-0">
          <DashboardSidebar />
        </aside>
        <main className="flex-1 w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
