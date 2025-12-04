"use client";

import Link from "next/link";

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
    <div className="py-16">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex flex-col gap-6 lg:flex-1 animate-[fadeInLeft_0.8s_ease-out]">
          <div className="flex flex-col gap-4 text-left">
            <h1 className="text-white text-5xl font-black leading-tight tracking-tight animate-[fadeInUp_0.6s_ease-out]">
              {title}
            </h1>
            <p className="text-text-muted text-lg font-normal leading-normal animate-[fadeInUp_0.8s_ease-out]">
              {subtitle}
            </p>
          </div>
          <Link
            href={'/auth/signup'}
            onClick={ctaAction}
            className="group relative flex h-12 min-w-[84px] max-w-xs cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#D4AF37] px-4 text-base font-bold text-background-dark transition-all duration-300 hover:bg-yellow-600 hover:shadow-lg hover:shadow-[#D4AF37]/50 hover:scale-105 active:scale-95 animate-[fadeInUp_1s_ease-out]"
          >
            <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
            <span className="truncate">{ctaText}</span>
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </Link>
        </div>
        <div className="lg:flex-1 animate-[fadeInRight_0.8s_ease-out]">
          <div
            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-2xl border border-border shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-[#D4AF37]/20 hover:border-[#D4AF37]/50 cursor-pointer"
            style={{ backgroundImage: `url("${heroImage}")` }}
          />
        </div>
      </div>
    </div>
  );
}
