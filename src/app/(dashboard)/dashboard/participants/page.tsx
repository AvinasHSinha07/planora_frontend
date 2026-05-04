import { Metadata } from "next";
import ParticipantsClient from "@/components/modules/Dashboard/Participants/ParticipantsClient";

export const metadata: Metadata = {
  title: "Participants | Planora Dashboard",
  description: "View and manage event participants",
};

export default function ParticipantsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Participants Overview</h1>
        <p className="text-muted-foreground mt-2">Track your attendees and manage join requests across all your organized events.</p>
      </div>
      <ParticipantsClient />
    </div>
  );
}
