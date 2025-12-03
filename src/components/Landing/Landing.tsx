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
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
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
      </div>
    </div>
  );
}
