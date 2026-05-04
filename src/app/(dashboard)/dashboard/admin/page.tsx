import AdminClient from "@/components/modules/Admin/AdminClient";
import { Metadata } from "next";
import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Console | Planora Dashboard",
  description: "Manage system operations",
};

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function AdminPage() {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <AdminClient />
    </Suspense>
  );
}
