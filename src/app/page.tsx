import HeroSection from "@/components/modules/Home/HeroSection";
import HowItWorksSection from "@/components/modules/Home/HowItWorksSection";
import UpcomingEventsWrapper from "@/components/modules/Home/UpcomingEventsWrapper";
import CategoriesWrapper from "@/components/modules/Home/CategoriesWrapper";
import FeaturedEventsWrapper from "@/components/modules/Home/FeaturedEventsWrapper";
import StatisticsSection from "@/components/modules/Home/StatisticsSection";
import TestimonialsSection from "@/components/modules/Home/TestimonialsSection";
import NewsletterSection from "@/components/modules/Home/NewsletterSection";
import CTASection from "@/components/modules/Home/CTASection";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const revalidate = 3600; // ISR: 1 hour

function SectionSkeleton() {
  return (
    <div className="container mx-auto py-24 space-y-12 animate-pulse">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="h-6 w-40 bg-primary/10 rounded-full" />
        <div className="h-16 w-full max-w-xl bg-muted rounded-2xl" />
        <div className="h-6 w-full max-w-md bg-muted/50 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-[450px] bg-muted/20 rounded-[3rem] border border-muted/30" />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      
      <Suspense fallback={<SectionSkeleton />}>
        <UpcomingEventsWrapper />
      </Suspense>

      <HowItWorksSection />

      <Suspense fallback={<SectionSkeleton />}>
        <CategoriesWrapper />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <FeaturedEventsWrapper />
      </Suspense>

      <StatisticsSection />
      <TestimonialsSection />
      <NewsletterSection />
      <CTASection />
    </>
  );
}
