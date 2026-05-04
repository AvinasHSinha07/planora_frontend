import HeroSection from "./HeroSection";
import UpcomingEventsSlider from "./UpcomingEventsSlider";
import HowItWorksSection from "./HowItWorksSection";
import CategoriesSection from "./CategoriesSection";
import FeaturedEvents from "./FeaturedEvents";
import StatisticsSection from "./StatisticsSection";
import TestimonialsSection from "./TestimonialsSection";
import NewsletterSection from "./NewsletterSection";
import CTASection from "./CTASection";

export default function HomeClient() {
  return (
    <>
      <HeroSection />
      <UpcomingEventsSlider />
      <HowItWorksSection />
      <CategoriesSection />
      <FeaturedEvents />
      <StatisticsSection />
      <TestimonialsSection />
      <NewsletterSection />
      <CTASection />
    </>
  );
}
