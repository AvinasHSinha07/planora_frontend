import MyEventsClient from "@/components/modules/Dashboard/Events/MyEventsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Events | Planora Dashboard",
  description: "Manage your events",
};

export default function EventsPage() {
  return <MyEventsClient />;
}
