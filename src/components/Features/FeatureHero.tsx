"use client";

interface FeatureHeroProps {
  title: string;
  description: string;
}

export default function FeatureHero({ title, description }: FeatureHeroProps) {
  return (
    <div className="py-16 text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3 mb-4 animate-[fadeInDown_0.6s_ease-out]">
          <div className="size-3 rounded-full bg-[#D4AF37] animate-pulse"></div>
          <div className="size-3 rounded-full bg-[#D4AF37] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="size-3 rounded-full bg-[#D4AF37] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <h1 className="text-white text-5xl font-black leading-tight tracking-tight animate-[fadeInUp_0.8s_ease-out]">
          {title}
        </h1>
        <p className="text-text-muted text-lg font-normal leading-normal max-w-2xl animate-[fadeInUp_1s_ease-out]">
          {description}
        </p>
        <div className="h-1 w-24 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent animate-[pulse_2s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
}
