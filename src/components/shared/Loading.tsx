"use client";
import React from "react";

const Loading: React.FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-background-dark text-white overflow-hidden h-screen w-full flex flex-col items-center justify-center relative font-['Lexend'] selection:bg-(--accent-gold) selection:text-background-dark"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background-dark opacity-95 z-10" />
        <div className="absolute inset-0 islamic-pattern opacity-[0.07] z-0 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-linear-to-b from-background-dark via-transparent to-background-dark z-10" />
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-md p-8 animate-fadeInUp">
        <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-(--accent-gold) blur-3xl opacity-5 rounded-full animate-glow" />
          <div className="absolute w-20 h-20 border border-(--accent-gold)/20 animate-[spin_12s_linear_infinite] rounded-full" />
          <div className="absolute w-20 h-20 border border-(--accent-gold)/20 rotate-45 animate-[spin_12s_linear_infinite] rounded-full" />
          <div className="absolute w-24 h-24 rounded-full border border-border" />
          <div className="absolute w-24 h-24 rounded-full border-t border-(--accent-gold) animate-spin" />
          <div className="absolute w-16 h-16 rounded-full border-b border-(--accent-gold)/50 animate-[spin_3s_linear_infinite_reverse]" />
          <div className="absolute flex items-center justify-center">
            <span className="material-symbols-outlined text-(--accent-gold) text-3xl drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
              auto_awesome_mosaic
            </span>
          </div>
        </div>

        <div className="text-center space-y-3 mb-10">
          <h1 className="text-3xl font-light text-white tracking-wide">
            Loading <span className="font-bold text-(--accent-gold)">IlmSpace</span>
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-text-muted text-sm font-['Noto_Sans'] tracking-wide">
              Preparing your study space...
            </p>
          </div>
        </div>

        <div className="w-full max-w-[200px] h-0.5 bg-border rounded-full overflow-hidden relative">
          <div
            className="absolute top-0 left-0 h-full w-1/2 bg-(--accent-gold) rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)] animate-[translate-x-full_1.5s_ease-in-out_infinite]"
            style={{ marginLeft: "-50%" }}
          />
        </div>
      </div>

      <div className="absolute bottom-10 z-20 text-[#5f6368] text-[10px] tracking-[0.2em] uppercase font-medium">
        Seek Knowledge • Preserve It
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeInUp {
          animation: fadeIn 0.5s ease-in;
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;