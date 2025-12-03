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
    <div className="flex flex-1 gap-4 rounded-lg border border-[#3b4554] bg-[#1b2027] p-4 flex-col transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:translate-y-[-4px] group">
      <div className="text-primary transition-transform duration-300 group-hover:scale-110">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-white text-base font-bold leading-tight">
          {title}
        </h2>
        <p className="text-[#9ca8ba] text-sm font-normal leading-normal">
          {description}
        </p>
      </div>
    </div>
  );
}
