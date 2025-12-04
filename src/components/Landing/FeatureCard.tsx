"use client";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card-bg/50 p-6 backdrop-blur-sm transition-all duration-500 hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-[#D4AF37]/20 hover:-translate-y-2 hover:bg-card-bg/80 group cursor-pointer animate-[fadeInUp_0.6s_ease-out]">
      <div className="flex size-12 items-center justify-center rounded-full bg-border text-[#D4AF37] transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:bg-[#D4AF37] group-hover:text-background-dark group-hover:shadow-lg group-hover:shadow-[#D4AF37]/50">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-white text-lg font-bold leading-tight transition-colors duration-300 group-hover:text-[#D4AF37]">
          {title}
        </h3>
        <p className="text-text-muted text-sm font-normal leading-normal transition-colors duration-300 group-hover:text-white">
          {description}
        </p>
      </div>
      <div className="h-1 w-0 bg-linear-to-r from-[#D4AF37] to-yellow-600 rounded-full transition-all duration-500 group-hover:w-full"></div>
    </div>
  );
}
