"use client";
import React from "react";

export default function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between px-8 py-5 w-full pointer-events-none">
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="text-[var(--accent-gold)] size-8 opacity-90 drop-shadow-md">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
          </svg>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-[#f0ebd9] font-sans drop-shadow-sm">IlmSpace</h1>
          <span className="text-xs text-[#f0ebd9]/60 font-sans tracking-wide">Personal Study Notebook</span>
        </div>
      </div>
      <div className="pointer-events-auto flex items-center gap-4">
        <div className="bg-black/20 backdrop-blur-md border border-white/5 rounded-full px-4 py-1.5 flex items-center gap-3 shadow-inner">
          <span className="material-symbols-outlined text-white/40 text-sm">schedule</span>
          <span className="text-xs font-medium text-white/60 font-sans">04:32 PM</span>
        </div>
        <button className="flex items-center justify-center size-10 rounded-full bg-black/20 hover:bg-[var(--accent-gold)] hover:text-black transition-all duration-300 text-white/60 border border-white/5 shadow-lg group">
          <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">grid_view</span>
        </button>
      </div>
    </header>
  );
}
