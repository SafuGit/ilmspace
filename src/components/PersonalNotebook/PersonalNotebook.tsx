/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Header from "./Header";
import SideControls from "./SideControls";
import NotebookPage from "./NotebookPage";
import Footer from "./Footer";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import Loading from "../shared/Loading";

export default function PersonalNotebook({ notebookId }: { notebookId: string }) {
  const { data, isLoading } = useSWR(`/api/notebooks/${notebookId}`, fetcher);

  if (isLoading) return <Loading />

  // Safely access pages returned by the API and render them into the two visible pages
  const pages = data?.pages || [];
  const pagesSorted = [...pages].sort((a: any, b: any) => (a.pageNumber || 0) - (b.pageNumber || 0));
  const leftPage = pagesSorted[0] ?? null;
  const rightPage = pagesSorted[1] ?? null;

  const pageToContent = (p: any) => {
    if (!p) return "";
    const lines: string[] = [];
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
    for (let i = 1; i <= 15; i++) {
      const raw = p[`line${i}`];
      if (raw == null) {
        lines.push("");
        continue;
      }
      const v = String(raw).trim();
      if (isoRegex.test(v)) {
        try {
          const d = new Date(v);
          if (!isNaN(d.getTime())) {
            const pad = (n: number) => n.toString().padStart(2, "0");
            const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            const formatted = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
            lines.push(formatted);
            continue;
          }
        } catch (e) {
          // fallthrough to push raw value
        }
      }
      lines.push(v);
    }
    return lines.join("\n");
  }

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
                title={data?.name || ""}
                pageNumber={leftPage?.pageNumber}
                type={leftPage?.type}
                initialContent={pageToContent(leftPage)}
              />
            </div>
            <div className="relative z-20 w-0 shrink-0">
              <div className="absolute top-0 bottom-0 -left-6 w-12 spine-crease pointer-events-none mix-blend-multiply"></div>
              <div className="absolute top-[10%] bottom-[10%] left-1/2 -translate-x-1/2 w-px border-l border-dashed border-white/40 opacity-50"></div>
            </div>
            <div className="flex-1 overflow-hidden">
              <NotebookPage
                side="right"
                title={data?.playlist?.name || ""}
                rtl
                pageNumber={rightPage?.pageNumber}
                type={rightPage?.type}
                initialContent={pageToContent(rightPage)}
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