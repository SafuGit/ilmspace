"use client";

import FeatureHero from "./FeatureHero";
import DetailedFeaturesSection from "./DetailedFeaturesSection";
import Footer from "../Landing/Footer";
import { featuresData } from "@/data/featuresData";
import { landingData } from "@/data/landingData";

export default function Features() {
  const handleCTAClick = () => {
    console.log("CTA clicked");
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <main>
              <FeatureHero {...featuresData.hero} />

              <DetailedFeaturesSection
                features={featuresData.detailedFeatures}
              />
            </main>

            <Footer {...landingData.footer} />
          </div>
        </div>
      </div>
    </div>
  );
}
