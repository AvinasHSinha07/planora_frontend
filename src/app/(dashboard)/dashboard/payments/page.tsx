import PaymentsClient from "@/components/modules/Dashboard/Payments/PaymentsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments | Planora Dashboard",
  description: "Track your event investments and transaction details.",
};

export default function PaymentsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight uppercase italic">Payment <span className="text-primary">History</span></h1>
        <p className="text-muted-foreground mt-2 italic">Track your event investments and transaction details.</p>
      </div>
      <PaymentsClient />
    </div>
  );
}
