"use client";
import React from "react";

export default function SideControls({ side = "left" }: { side?: "left" | "right" }) {
  const tooltipPos = side === "left" ? "left-full ml-4" : "right-full mr-4";
  const translateX = side === "left" ? "translate-x-[-10px]" : "translate-x-[10px]";
  const groupHoverTranslate = side === "left" ? "group-hover:translate-x-0" : "group-hover:translate-x-0";

  const buttons = side === "left" ? [
    { icon: "arrow_back", tooltip: "Previous Page" },
    { icon: "bookmark_border", tooltip: "Bookmarks" },
    { icon: "library_books", tooltip: "Library" },
  ] : [
    { icon: "arrow_forward", tooltip: "Next Page" },
    { icon: "zoom_in", tooltip: "Focus Mode" },
    { icon: "edit_note", tooltip: "Writing Tools" },
  ];

  return (
    <div className={`absolute ${side === "left" ? "left-8 lg:left-12" : "right-8 lg:right-12"} top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20 pointer-events-none`}>
      {buttons.map((btn, idx) => (
        <button key={idx} className="group relative pointer-events-auto flex items-center justify-center size-12 rounded-full bg-[#2A2624] border border-[#3e3832] text-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:bg-[#38322e] hover:text-(--accent-gold) hover:border-(--accent-gold)/30 hover:-translate-y-0.5 transition-all duration-300">
          <span className="material-symbols-outlined">{btn.icon}</span>
          <span className={`absolute ${tooltipPos} px-2.5 py-1.5 bg-[#1A1614] border border-white/10 text-xs text-white/90 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl font-sans ${translateX} ${groupHoverTranslate} duration-200`}>{btn.tooltip}</span>
        </button>
      ))}
    </div>
  );
}
