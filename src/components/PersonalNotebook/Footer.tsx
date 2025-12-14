"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="absolute bottom-0 w-full p-6 text-center z-10 pointer-events-none flex justify-between items-end px-10">
      <div className="text-xs text-white/20 font-sans tracking-wide">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
          <span>Changes Saved</span>
        </div>
      </div>
      <p className="text-xs text-white/10 font-sans tracking-widest uppercase">© 2024 IlmSpace</p>
    </footer>
  );
}