"use client";

import FeatureHero from "./FeatureHero";
import DetailedFeaturesSection from "./DetailedFeaturesSection";
import Footer from "../shared/Footer";
import { featuresData } from "@/data/featuresData";
import { landingData } from "@/data/landingData";

export default function Features() {
  return (
    <div className="flex-1 px-10 py-8">
      <div className="mx-auto max-w-7xl">
        <main>
          <FeatureHero {...featuresData.hero} />

          <DetailedFeaturesSection
            features={featuresData.detailedFeatures}
          />
        </main>

        <Footer {...landingData.footer} />
      </div>
    </div>
  );
}
