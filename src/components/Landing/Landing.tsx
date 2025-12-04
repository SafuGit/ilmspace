"use client";

import HeroSection from "./HeroSection";
import ContentSection from "./ContentSection";
import FeaturesGrid from "./FeaturesGrid";
import CTASection from "./CTASection";
import Footer from "./Footer";
import { landingData } from "@/data/landingData";

export default function Landing() {
  const handleCTAClick = () => {
    console.log("CTA clicked");
  };

  return (
    <div className="flex-1 px-10 py-8">
      <div className="mx-auto max-w-7xl">
        <main>
          <HeroSection
            {...landingData.hero}
            ctaAction={handleCTAClick}
          />

          <ContentSection {...landingData.engageSection} />

          <FeaturesGrid
            title={landingData.features.title}
            description={landingData.features.description}
            features={landingData.features.items}
          />

          <CTASection {...landingData.cta} ctaAction={handleCTAClick} />
        </main>

        <Footer {...landingData.footer} />
      </div>
    </div>
  );
}
