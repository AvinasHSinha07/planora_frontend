import MyEventsClient from "@/components/modules/Dashboard/Events/MyEventsClient";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "My Events | Planora Dashboard",
  description: "Manage your events",
};

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <MyEventsClient />
    </Suspense>
  );
}
