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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
      <div className={`flex flex-col gap-4 ${reversed ? "lg:order-2" : ""}`}>
        <div className="inline-flex items-center gap-3">
          <div className="flex items-center justify-center size-10 bg-primary/10 text-primary rounded-lg">
            <span className="material-symbols-outlined text-2xl">{icon}</span>
          </div>
          <h2 className="text-primary text-sm font-bold uppercase tracking-wider">
            {category}
          </h2>
        </div>
        <h3 className="text-white tracking-tight text-3xl font-bold leading-tight md:text-4xl md:font-black md:leading-tight md:tracking-[-0.033em]">
          {title}
        </h3>
        <p className="text-slate-300 text-base font-normal leading-normal">
          {description}
        </p>
      </div>
      <div
        className={`w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl transition-transform duration-300 hover:scale-105 ${
          reversed ? "lg:order-1" : ""
        }`}
        style={{ backgroundImage: `url("${image}")` }}
        role="img"
        aria-label={imageAlt}
      />
    </div>
  );
}
