"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/modules/Dashboard/DashboardSidebar";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isPending && !session && mounted) {
      console.log("[DASHBOARD] No session found, redirecting to login...");
      router.push("/login");
    }
  }, [session, isPending, mounted, router]);

  if (!mounted || isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium animate-pulse text-muted-foreground">Synchronizing Planora Environment...</p>
        </div>
      </div>
    );
  }

  // If we're not loading and there's no session, we don't render anything 
  // while the useEffect handles the redirect.
  if (!session) {
    return null;
  }

  const userRole = (session.user as any)?.role || "USER";

  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Desktop Sidebar: Fixed height and sticky to the viewport */}
      <aside className="w-64 border-r bg-card hidden md:block flex-shrink-0 sticky top-0 h-screen">
        <div className="p-4 h-full">
          <DashboardSidebar />
        </div>
      </aside>

      {/* Main Content: Natural flow with browser scrollbar */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-10">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
