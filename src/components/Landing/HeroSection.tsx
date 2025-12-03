"use client";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaAction?: () => void;
  heroImage: string;
}

export default function HeroSection({
  title,
  subtitle,
  ctaText,
  ctaAction,
  heroImage,
}: HeroSectionProps) {
  return (
    <div className="py-10">
      <div className="flex flex-col gap-6 px-4 md:gap-8 lg:flex-row-reverse">
        <div
          className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl md:h-auto md:min-w-[400px] lg:w-full"
          style={{ backgroundImage: `url("${heroImage}")` }}
        />
        <div className="flex flex-col gap-6 md:min-w-[400px] md:gap-8 lg:justify-center">
          <div className="flex flex-col gap-2 text-left">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl md:font-black md:leading-tight md:tracking-[-0.033em]">
              {title}
            </h1>
            <h2 className="text-slate-300 text-base font-normal leading-normal md:text-lg md:font-normal md:leading-normal">
              {subtitle}
            </h2>
          </div>
          <button
            onClick={ctaAction}
            className="group relative flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 md:h-12 md:px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] md:text-base md:font-bold md:leading-normal md:tracking-[0.015em] transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 truncate">{ctaText}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-600 to-primary bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
