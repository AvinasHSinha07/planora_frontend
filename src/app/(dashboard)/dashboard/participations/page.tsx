import { Metadata } from "next";
import ParticipationsClient from "@/components/modules/Dashboard/Participations/ParticipationsClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "My Participations | Planora Dashboard",
  description: "View the events you have joined or requested to join.",
};

export default function ParticipationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Participations</h1>
        <p className="text-muted-foreground mt-2">Manage and track all the events you are attending.</p>
      </div>
      <Suspense fallback={
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <ParticipationsClient />
      </Suspense>
    </div>
  );
}
