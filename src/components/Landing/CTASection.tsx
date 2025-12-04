"use client";

import Link from "next/link";

interface CTASectionProps {
  title: string;
  description: string;
  ctaText: string;
  ctaAction?: () => void;
}

export default function CTASection({
  title,
  description,
  ctaText,
  ctaAction,
}: CTASectionProps) {
  return (
    <div className="px-4 py-16">
      <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-primary/20 text-center p-8 md:p-12 backdrop-blur-sm border border-primary/30">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          {title}
        </h2>
        <p className="max-w-xl text-base md:text-lg text-slate-300">
          {description}
        </p>
        <Link
          href={'/auth/signup'}
          onClick={ctaAction}
          className="group relative flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 truncate">{ctaText}</span>
          <div className="absolute inset-0 bg-linear-to-r from-primary via-blue-600 to-primary bg-size-[200%_100%]nimate-[shimmer_3s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      </div>
    </div>
  );
}
