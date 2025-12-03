"use client";

interface FeatureHeroProps {
  title: string;
  description: string;
}

export default function FeatureHero({ title, description }: FeatureHeroProps) {
  return (
    <div className="py-16 px-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl">
          {title}
        </h1>
        <p className="text-slate-300 text-lg font-normal leading-normal max-w-2xl">
          {description}
        </p>
      </div>
    </div>
  );
}
