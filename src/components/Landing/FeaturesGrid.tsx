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
    <div className="flex flex-col gap-10 px-4 py-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-white tracking-light text-[32px] font-bold leading-tight md:text-4xl md:font-black md:leading-tight md:tracking-[-0.033em] max-w-[720px]">
          {title}
        </h1>
        <p className="text-slate-300 text-base font-normal leading-normal max-w-[720px]">
          {description}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
}
