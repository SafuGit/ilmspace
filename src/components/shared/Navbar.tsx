"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid px-4 md:px-10 py-3 transition-all duration-300 ${
        scrolled
          ? "bg-background-dark/80 backdrop-blur-xl border-white/20 shadow-lg shadow-primary/5"
          : "bg-background-dark/50 backdrop-blur-sm border-white/10"
      }`}
    >
      <Link href="/" className="flex items-center gap-4 text-white group">
        <div className="size-6 text-primary transition-transform duration-300 group-hover:rotate-180 group-hover:scale-110">
          <svg
            fill="currentColor"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_8px_rgba(15,104,230,0.5)]"
          >
            <g clipPath="url(#clip0_6_319)">
              <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"></path>
            </g>
            <defs>
              <clipPath id="clip0_6_319">
                <rect fill="white" height="48" width="48"></rect>
              </clipPath>
            </defs>
          </svg>
        </div>
        <h2 className="text-white text-[18px] font-bold leading-tight tracking-[-0.015em] transition-all duration-300 group-hover:text-primary">
          IlmSpace
        </h2>
      </Link>
      <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
        <nav className="flex items-center gap-9">
          {[
            { name: "Features", href: "/features" },
            { name: "About", href: "#about" },
          ].map((link) => (
            <Link
              key={link.name}
              className="relative text-white/80 text-sm font-medium leading-normal transition-colors duration-300 hover:text-white"
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.name)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {link.name}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  hoveredLink === link.name ? "w-full" : "w-0"
                }`}
              />
            </Link>
          ))}
        </nav>
        {status === "authenticated" ? (
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-sm">{session?.user?.email}</span>
            <button className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border border-primary/50 text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/50 hover:scale-110 active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </button>
          </div>
        ) : (
          <Link href={'/auth/signup'} className="group relative flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 hover:scale-105 active:scale-95">
            <span className="relative z-10 truncate">Sign Up</span>
            <div className="absolute inset-0 bg-linear-to-r from-primary via-blue-600 to-primary bg-size-[200%_100%] animate-[shimmer_3s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        )}
      </div>
    </header>
  );
}
