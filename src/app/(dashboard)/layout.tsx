import { ReactNode } from "react";
import DashboardSidebar from "@/components/modules/Dashboard/DashboardSidebar";
import Navbar from "@/components/shared/Navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <Navbar />
      <div className="container mx-auto flex flex-1 overflow-hidden pt-4 pb-8 px-4 gap-6">
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
