import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Planora",
  description: "How we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-muted/10 pb-24">
      <div className="max-w-4xl mx-auto px-4 pt-32 space-y-16">
        {/* Header */}
        <div className="space-y-4 border-b pb-12">
          <h1 className="text-5xl font-black tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">Last Updated: May 04, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-slate prose-lg dark:prose-invert max-w-none space-y-12">
          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              Planora collects information to provide better services to our users. We collect information in the following ways:
            </p>
            <ul className="list-disc pl-6 space-y-4 text-muted-foreground">
              <li><strong>Information you give us:</strong> When you sign up for Planora, we'll ask for personal information, like your name, email address, or telephone number.</li>
              <li><strong>Information we get from your use of our services:</strong> We collect information about the services that you use and how you use them, like when you create an event or participate in one.</li>
              <li><strong>Log information:</strong> When you use our services or view content provided by Planora, we automatically collect and store certain information in server logs.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">2. How We Use Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect from all of our services to provide, maintain, protect and improve them, to develop new ones, and to protect Planora and our users.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We also use this information to offer you tailored content – like giving you more relevant event recommendations or specialized organizer tools.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">3. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We work hard to protect Planora and our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold. In particular:
            </p>
            <ul className="list-disc pl-6 space-y-4 text-muted-foreground">
              <li>We encrypt many of our services using SSL.</li>
              <li>We review our information collection, storage and processing practices, including physical security measures, to guard against unauthorized access to systems.</li>
              <li>We restrict access to personal information to Planora employees, contractors and agents who need to know that information in order to process it for us.</li>
            </ul>
          </section>

          <section className="space-y-6">
             <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 italic text-muted-foreground leading-relaxed">
                "Your privacy is our priority. We will never sell your personal data to third parties. Our business model is built on providing value to organizers and attendees, not on harvesting data."
             </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">4. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at privacy@planora.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
