import AdminClient from "@/components/modules/Admin/AdminClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Console | Planora Dashboard",
  description: "Manage system operations",
};

export default function AdminPage() {
  return <AdminClient />;
}
