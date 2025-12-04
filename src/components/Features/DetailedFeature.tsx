"use client";

interface DetailedFeatureProps {
  icon: string;
  category: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  reversed?: boolean;
}

export default function DetailedFeature({
  icon,
  category,
  title,
  description,
  image,
  imageAlt,
  reversed = false,
}: DetailedFeatureProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center group">
      <div className={`flex flex-col gap-6 ${reversed ? "lg:order-2 animate-[fadeInRight_0.8s_ease-out]" : "animate-[fadeInLeft_0.8s_ease-out]"}`}>
        <div className="inline-flex items-center gap-3 animate-[fadeInUp_0.6s_ease-out]">
          <div className="flex items-center justify-center size-12 bg-border text-[#D4AF37] rounded-full transition-all duration-500 group-hover:rotate-180 group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-background-dark group-hover:shadow-lg group-hover:shadow-[#D4AF37]/50">
            <span className="material-symbols-outlined text-2xl">{icon}</span>
          </div>
          <h2 className="text-[#D4AF37] text-sm font-bold uppercase tracking-wider transition-all duration-300 group-hover:tracking-widest">
            {category}
          </h2>
        </div>
        <h3 className="text-white tracking-tight text-3xl font-bold leading-tight md:text-4xl animate-[fadeInUp_0.8s_ease-out] transition-colors duration-300 group-hover:text-[#D4AF37]">
          {title}
        </h3>
        <p className="text-text-muted text-base font-normal leading-normal animate-[fadeInUp_1s_ease-out] transition-colors duration-300 group-hover:text-white">
          {description}
        </p>
        <div className="flex items-center gap-2 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-5 group-hover:translate-x-0">
          <span className="text-sm font-bold">Explore this feature</span>
          <span className="material-symbols-outlined text-sm animate-[bounce_1s_ease-in-out_infinite]">arrow_forward</span>
        </div>
      </div>
      <div className={`relative ${reversed ? "lg:order-1 animate-[fadeInLeft_0.8s_ease-out]" : "animate-[fadeInRight_0.8s_ease-out]"}`}>
        <div className="absolute inset-0 bg-linear-to-br from-[#D4AF37]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div
          className="relative w-full bg-center bg-no-repeat aspect-video bg-cover rounded-2xl border border-border shadow-lg transition-all duration-700 hover:scale-105 hover:rotate-1 hover:border-[#D4AF37]/50 hover:shadow-2xl hover:shadow-[#D4AF37]/30 cursor-pointer overflow-hidden"
          style={{ backgroundImage: `url("${image}")` }}
          role="img"
          aria-label={imageAlt}
        >
          <div className="absolute inset-0 bg-linear-to-t from-background-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>
    </div>
  );
}
