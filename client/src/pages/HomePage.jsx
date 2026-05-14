import { homePageData } from "../data/homeData";
import { HeroSection } from "../sections/home/HeroSection";
import { ServicesSection } from "../sections/home/ServicesSection";
import { WhyChooseSection } from "../sections/home/WhyChooseSection";
import { HowItWorksSection } from "../sections/home/HowItWorksSection";
import { FeaturedServicesSection } from "../sections/home/FeaturedServicesSection";
import { AboutSection } from "../sections/home/AboutSection";
import { TestimonialsSection } from "../sections/home/TestimonialsSection";
import { PricingSection } from "../sections/home/PricingSection";
import { GallerySection } from "../sections/home/GallerySection";

export function HomePage() {
  return (
    <>
      <HeroSection data={homePageData.hero} />
      <ServicesSection data={homePageData.services} />
      <WhyChooseSection data={homePageData.whyChooseUs} />
      <HowItWorksSection data={homePageData.howItWorks} />
      <FeaturedServicesSection data={homePageData.featuredServices} />
      <AboutSection data={homePageData.about} />
      <TestimonialsSection data={homePageData.testimonials} />
      <PricingSection data={homePageData.pricing} />
      <GallerySection data={homePageData.gallery} />
    </>
  );
}
