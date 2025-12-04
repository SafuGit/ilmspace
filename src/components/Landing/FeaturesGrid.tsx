"use client";

import FeatureCard from "./FeatureCard";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesGridProps {
  title: string;
  description: string;
  features: Feature[];
}

export default function FeaturesGrid({
  title,
  description,
  features,
}: FeaturesGridProps) {
  return (
    <div className="flex flex-col gap-10 py-16">
      <div className="flex flex-col gap-4">
        <h2 className="text-white text-3xl font-bold leading-tight tracking-tight">
          {title}
        </h2>
        <p className="text-text-muted text-base font-normal leading-normal">
          {description}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
}
