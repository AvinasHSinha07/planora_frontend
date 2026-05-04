import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Planora",
  description: "The rules and guidelines for using the Planora platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-muted/10 pb-24">
      <div className="max-w-4xl mx-auto px-4 pt-32 space-y-16">
        {/* Header */}
        <div className="space-y-4 border-b pb-12">
          <h1 className="text-5xl font-black tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">Last Updated: May 04, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-slate prose-lg dark:prose-invert max-w-none space-y-12">
          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using the Planora platform (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">2. Use of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              You must be at least 18 years old to use the Service. You agree to use the Service only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">3. Event Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              Organizers are solely responsible for the content of their events. Planora does not endorse and has no control over the events listed on the platform. We reserve the right to remove any event that violates our community guidelines.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">4. Fees and Payments</h2>
            <p className="text-muted-foreground leading-relaxed">
              Service fees are non-refundable unless otherwise stated. Planora uses third-party payment processors to handle transactions. By using the Service, you agree to the terms of these payment processors.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">5. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed font-semibold italic">
              Planora is provided "as is" without warranty of any kind. In no event shall Planora be liable for any indirect, incidental, or consequential damages arising out of your use of the Service.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">6. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Planora is headquartered, without regard to its conflict of law provisions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
