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
    <div className="flex flex-col gap-10 px-4 py-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-white tracking-light text-[32px] font-bold leading-tight md:text-4xl md:font-black md:leading-tight md:tracking-[-0.033em] max-w-[720px]">
          {title}
        </h1>
        <p className="text-slate-300 text-base font-normal leading-normal max-w-[720px]">
          {description}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col gap-3 pb-3 group cursor-pointer">
            <div
              className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundImage: `url("${item.image}")` }}
            />
            <div>
              <p className="text-white text-lg font-medium leading-normal">
                {item.title}
              </p>
              <p className="text-[#9ca8ba] text-sm font-normal leading-normal">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
