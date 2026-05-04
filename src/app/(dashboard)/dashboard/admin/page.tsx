import AdminClient from "@/components/modules/Admin/AdminClient";
import { Metadata } from "next";
import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Console | Planora Dashboard",
  description: "Manage system operations",
};

export default async function AdminPage() {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect("/dashboard");
  }

  return <AdminClient />;
}
