"use client";
import React from "react";

type Props = {
  side: "left" | "right";
  title?: string;
  children?: React.ReactNode;
  rtl?: boolean;
};

export default function NotebookPage({ side, title, children, rtl }: Props) {
  const isLeft = side === "left";
  return (
    <div className={`relative z-10 h-full w-full px-[50px] py-10 flex flex-col notebook-page ${isLeft ? "notebook-page-left" : "notebook-page-right"}`}>
      <div className="absolute inset-0 opacity-[0.4] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none mix-blend-multiply"></div>
      <div className="flex justify-between items-end h-[30px] mb-4 border-b border-(--line-color) pb-1" dir={rtl ? "rtl" : "ltr"}>
        <input className={`bg-transparent border-none p-0 text-sm font-sans tracking-widest text-slate-500 uppercase placeholder:text-slate-300 w-full focus:ring-0 ${rtl ? "text-right" : ""}`} type="text" value={title || ""} readOnly />
      </div>
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 page-lines pointer-events-none w-full h-full"></div>
        <div className={`relative h-full ${rtl ? "font-arabic text-[1.8rem] leading-10 text-right pr-[30px] pl-2" : "font-scholarly text-[1.5rem] leading-10 pl-[30px] pr-2"} ink-text outline-none custom-scroll overflow-y-auto writing-cursor whitespace-pre-wrap break-words`} contentEditable suppressContentEditableWarning spellCheck={false} dir={rtl ? "rtl" : "ltr"}>
          {children}
        </div>
      </div>
      <div className={`absolute bottom-4 ${isLeft ? "left-8" : "right-8"} font-handwritten text-xl text-slate-400 select-none`}> 
        {isLeft ? "142" : "143"}
      </div>
    </div>
  );
}
