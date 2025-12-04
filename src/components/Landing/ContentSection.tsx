"use client";

interface ContentItem {
  image: string;
  title: string;
  description: string;
}

interface ContentSectionProps {
  title: string;
  description: string;
  items: ContentItem[];
}

export default function ContentSection({
  title,
  description,
  items,
}: ContentSectionProps) {
  return (
    <div className="flex flex-col gap-10 py-16">
      <div className="flex flex-col gap-4 animate-[fadeInUp_0.6s_ease-out]">
        <h2 className="text-white text-3xl font-bold leading-tight tracking-tight">
          {title}
        </h2>
        <p className="text-text-muted text-base font-normal leading-normal">
          {description}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card-bg/50 overflow-hidden backdrop-blur-sm transition-all duration-500 hover:border-[#D4AF37]/50 hover:shadow-2xl hover:shadow-[#D4AF37]/20 hover:-translate-y-2 group cursor-pointer animate-[fadeInUp_0.6s_ease-out]"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative overflow-hidden">
              <div
                className="w-full bg-center bg-no-repeat aspect-4/3 bg-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                style={{ backgroundImage: `url("${item.image}")` }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-background-dark via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
            </div>
            <div className="px-6 pb-6">
              <p className="text-white text-lg font-semibold leading-normal mb-2 transition-colors duration-300 group-hover:text-[#D4AF37]">
                {item.title}
              </p>
              <p className="text-text-muted text-sm font-normal leading-normal transition-colors duration-300 group-hover:text-white">
                {item.description}
              </p>
              <div className="mt-3 flex items-center gap-2 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2.5 group-hover:translate-x-0">
                <span className="text-sm font-semibold">Learn more</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
