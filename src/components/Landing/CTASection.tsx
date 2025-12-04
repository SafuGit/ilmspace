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
    <div className="py-16">
      <div className="relative flex flex-col items-center justify-center gap-6 rounded-2xl bg-card-bg/50 text-center p-8 md:p-12 backdrop-blur-sm border border-border overflow-hidden transition-all duration-500 hover:border-[#D4AF37]/50 hover:shadow-2xl hover:shadow-[#D4AF37]/20 animate-[fadeInUp_0.8s_ease-out]">
        <div className="absolute inset-0 bg-linear-to-br from-[#D4AF37]/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute -top-20 -right-20 size-40 rounded-full bg-[#D4AF37]/10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 size-40 rounded-full bg-[#D4AF37]/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <h2 className="relative text-3xl md:text-4xl font-bold tracking-tight text-white animate-[fadeInUp_0.6s_ease-out]">
          {title}
        </h2>
        <p className="relative max-w-xl text-base md:text-lg text-text-muted animate-[fadeInUp_0.8s_ease-out]">
          {description}
        </p>
        <Link
          href={'/auth/signup'}
          onClick={ctaAction}
          className="group relative flex h-12 min-w-[84px] max-w-xs cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#D4AF37] px-6 text-base font-bold text-background-dark transition-all duration-300 hover:bg-yellow-600 hover:shadow-xl hover:shadow-[#D4AF37]/50 hover:scale-110 active:scale-95 animate-[fadeInUp_1s_ease-out]"
        >
          <span className="material-symbols-outlined transition-transform duration-300 group-hover:rotate-90">stars</span>
          <span className="truncate">{ctaText}</span>
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </Link>
      </div>
    </div>
  );
}
