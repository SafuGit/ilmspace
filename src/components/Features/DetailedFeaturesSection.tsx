"use client";

import DetailedFeature from "./DetailedFeature";

interface DetailedFeatureItem {
  icon: string;
  category: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface DetailedFeaturesSectionProps {
  features: DetailedFeatureItem[];
}

export default function DetailedFeaturesSection({
  features,
}: DetailedFeaturesSectionProps) {
  return (
    <div className="flex flex-col gap-16 px-4 py-10">
      {features.map((feature, index) => (
        <DetailedFeature
          key={index}
          {...feature}
          reversed={index % 2 !== 0}
        />
      ))}
    </div>
  );
}
