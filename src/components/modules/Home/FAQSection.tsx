"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What exactly is Planora?",
    answer: "Planora is a premium, all-in-one event management ecosystem designed for elite organizers and attendees. We provide the tools to discover, create, manage, and monetize experiences with a focus on quality and security.",
  },
  {
    question: "How do I become an Organizer?",
    answer: "Simply register for an account and navigate to your dashboard. From there, you can upgrade your role to 'Organizer' and begin creating events immediately. You'll gain access to advanced analytics and participant management tools.",
  },
  {
    question: "Is the payment system secure?",
    answer: "Absolutely. Planora integrates directly with Stripe, the industry standard for secure online payments. Your financial data never touches our servers, and every transaction is encrypted and verified.",
  },
  {
    question: "What is the difference between Public and Private events?",
    answer: "Public events are visible to everyone in our community. Private events are exclusive experiences that require either a direct invitation from the host or an approved 'Request Access' application.",
  },
  {
    question: "Can I manage invitations through the platform?",
    answer: "Yes! Planora features a robust internal invitation system. Hosts can send digital invites to any user, and invitees can accept, decline, or pay for their spot directly within their personal dashboard.",
  },
  {
    question: "How does the AI Concierge help me?",
    answer: "PlanoraBot is synchronized with live platform data. It can recommend events based on your interests, check for upcoming sessions in your city, and provide real-time platform statistics to help you navigate the ecosystem.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight px-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Have questions? We&apos;ve got answers. Find information about hosting, payments, and platform features.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl md:rounded-3xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                >
                  <h3 className="text-base md:text-xl font-bold leading-tight">
                    {faq.question}
                  </h3>
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-transform duration-300",
                    openIndex === index ? "rotate-180 bg-primary/10 border-primary/20 text-primary" : "text-muted-foreground"
                  )}>
                    <ChevronDown className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 md:px-6 md:pb-6 text-sm md:text-base text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12 px-4">
            <p className="text-sm md:text-base text-muted-foreground">
              Still have questions? Feel free to <span className="text-primary font-bold cursor-pointer hover:underline">contact our support team</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
