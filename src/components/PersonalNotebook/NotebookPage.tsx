"use client";
import React, { useRef, useEffect } from "react";

type Props = {
  side: "left" | "right";
  title?: string;
  initialContent?: string;
  rtl?: boolean;
};

export default function NotebookPage({ side, title, initialContent = "", rtl }: Props) {
  const isLeft = side === "left";
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && !contentRef.current.innerText.trim()) {
      contentRef.current.innerText = initialContent;
    }
  }, [initialContent]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const lines = target.innerText.split('\n');
    
    // If more than 15 lines, trim to 15 lines
    if (lines.length >= 15) {
      target.innerText = lines.slice(0, 16).join('\n');
      // Move cursor to end
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(target);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  return (
    <div className={`relative z-10 h-full w-full px-[50px] py-10 flex flex-col notebook-page ${isLeft ? "notebook-page-left" : "notebook-page-right"}`}>
      <div className="absolute inset-0 opacity-[0.4] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none mix-blend-multiply"></div>
      <div className="flex justify-between items-end h-[30px] mb-4 border-b border-(--line-color) pb-1" dir={rtl ? "rtl" : "ltr"}>
        <input className={`bg-transparent border-none p-0 text-sm font-sans tracking-widest text-slate-500 uppercase placeholder:text-slate-300 w-full focus:ring-0 ${rtl ? "text-right" : ""}`} type="text" value={title || ""} readOnly />
      </div>
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 page-lines pointer-events-none w-full h-full"></div>
        <div 
          ref={contentRef}
          className={`relative ${rtl ? "font-arabic text-[1.8rem] leading-10 text-right pr-[30px] pl-2" : "font-scholarly text-[1.5rem] leading-10 pl-[30px] pr-2"} ink-text outline-none custom-scroll overflow-hidden writing-cursor whitespace-pre-wrap break-words max-h-[600px]`} 
          contentEditable 
          suppressContentEditableWarning 
          spellCheck={false} 
          dir={rtl ? "rtl" : "ltr"}
          onInput={handleInput}
        />
      </div>
      <div className={`absolute bottom-4 ${isLeft ? "left-8" : "right-8"} font-handwritten text-xl text-slate-400 select-none`}> 
        {isLeft ? "142" : "143"}
      </div>
    </div>
  );
}
