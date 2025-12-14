"use client";
import React from "react";
import Header from "./Header";
import SideControls from "./SideControls";
import NotebookPage from "./NotebookPage";
import Footer from "./Footer";

export default function PersonalNotebook({ notebookId }: { notebookId: string }) {
  return (
    <div className="wood-texture min-h-screen flex flex-col text-[#d1d5db] font-scholarly selection:bg-(--accent-gold) selection:text-white">
      <div className="vignette-overlay absolute inset-0 pointer-events-none z-0"></div>
      <Header />
      <main className="relative z-0 flex-1 flex items-center justify-center p-4 perspective-[1800px] min-h-0">
        <SideControls side="left" />
        <div className="notebook-shadow relative w-full max-w-[1200px] aspect-[1.55/1] transition-transform duration-700 ease-out transform scale-95 hover:scale-[0.96] origin-center">
          <div className="absolute top-1 left-2 right-1 -bottom-2 bg-[#1a1512] rounded-sm transform rotate-[0.1deg] shadow-2xl border border-white/5 z-0"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#2c241f] rounded-sm shadow-lg border border-white/5 z-0"></div>
          <div className="absolute inset-[3px] top-[3px] bg-[#f4f1e8] rounded-[3px] flex z-10">
            <div className="flex-1 overflow-hidden">
              <NotebookPage 
                side="left" 
                title="Reflections: Treaty of Hudaybiyyah"
                initialContent={`The companions felt a heavy sadness, initially perceiving the terms as a defeat.
Yet, the revelation came down: "Verily, We have given you a manifest victory." (48:1)

It teaches us that immediate outcomes are not always the true measure of success.
The strategic pause allowed hearts to soften and Islam to spread through dialogue rather than defense.

Key Takeaways:
• Patience (Sabr) is active, not passive.
• Trust (Tawakkul) in Allah's plan over our limited vision.`}
              />
            </div>
            <div className="relative z-20 w-0 shrink-0">
              <div className="absolute top-0 bottom-0 -left-6 w-12 spine-crease pointer-events-none mix-blend-multiply"></div>
              <div className="absolute top-[10%] bottom-[10%] left-1/2 -translate-x-1/2 w-px border-l border-dashed border-white/40 opacity-50"></div>
            </div>
            <div className="flex-1 overflow-hidden">
              <NotebookPage 
                side="right" 
                title="Vocabulary &amp; Notes" 
                rtl
                initialContent={`صلح الحديبية
درس عميق في السياسة الشرعية والصبر.

قال الزهري: "فما فُتح في الإسلام فتح قبله كان أعظم منه."

نقاط للتأمل:
١. حكمة النبي صلى الله عليه وسلم في التفاوض.
٢. كيف تحولت الهدنة إلى نصر دعوي ساحق.`}
              />
            </div>
          </div>
          <div className="absolute -bottom-1.5 left-[3px] w-[calc(50%-3px)] h-1.5 page-thickness-left rounded-bl-sm z-20"></div>
          <div className="absolute -bottom-1.5 right-[3px] w-[calc(50%-3px)] h-1.5 page-thickness-right rounded-br-sm z-20"></div>
        </div>
        <SideControls side="right" />
      </main>
      <Footer />
    </div>
  );
}