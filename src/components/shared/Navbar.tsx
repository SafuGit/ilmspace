"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Navlink from "./Navlink";
import { alert } from "@/lib/alert";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [{ name: "Features", href: "/features" }];

  const authNavItems = [
    ...navItems,
    { name: "My Library", href: "/dashboard" },
    { name: "Upload Books", href: "/dashboard/upload-book" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid px-10 py-4 transition-all duration-300 ${
        scrolled
          ? "bg-background-dark/95 backdrop-blur-xl border-b-[#D4AF37]/20 shadow-lg shadow-[#D4AF37]/5"
          : "bg-background-dark/50 backdrop-blur-sm border-b-border"
      }`}
    >
      <Link href="/" className="flex items-center gap-4 group">
        <div className="text-[#D4AF37] size-6 transition-all duration-500 group-hover:rotate-180 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
          <svg
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_6_319)">
              <path
                d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                fill="currentColor"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_6_319">
                <rect fill="white" height="48" width="48"></rect>
              </clipPath>
            </defs>
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-[-0.015em] transition-colors duration-300 group-hover:text-[#D4AF37]">
          IlmSpace
        </h1>
      </Link>
      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-9">
          {status === "authenticated"
            ? authNavItems.map((link) => (
                <Navlink
                  key={link.name}
                  link={link}
                  hoveredLink={hoveredLink}
                  setHoveredLink={setHoveredLink}
                />
              ))
            : navItems.map((link) => (
                <Navlink
                  key={link.name}
                  link={link}
                  hoveredLink={hoveredLink}
                  setHoveredLink={setHoveredLink}
                />
              ))}
        </nav>
        <div className="flex items-center gap-4">
          <button className="relative flex size-10 items-center justify-center rounded-full bg-card-bg transition-all duration-300 hover:bg-border hover:scale-110 active:scale-95 cursor-pointer">
            <span className="material-symbols-outlined text-xl text-text-muted transition-colors hover:text-[#D4AF37]">
              notifications
            </span>
            <span className="absolute top-2 right-2 size-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
          </button>
          {status === "authenticated" ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="group flex items-center gap-2"
              >
                <div className="relative size-9">
                  {session.user?.image ? (
                    <Image
                      alt="User Avatar"
                      className="rounded-full object-cover ring-2 ring-border transition-all duration-300 group-hover:ring-[#D4AF37] group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#D4AF37]/50 cursor-pointer"
                      src={session.user!.image!}
                      width={36}
                      height={36}
                    />
                  ) : (
                    <Image
                      alt="User Avatar"
                      className="rounded-full object-cover ring-2 ring-border transition-all duration-300 group-hover:ring-[#D4AF37] group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#D4AF37]/50 cursor-pointer"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjj6oGh9eN7rd_wQp_quC4L2rf0mRTNetgsupoRiIKIeGsDtpy400Gi7M5es4AgrvPMuKsc2B3aSX9PQr6VFRb6dakbsIMRD6MBTDAcGSLW2bzPsq60Doda24O7f_IfYE_enSGdHyivTZHvNxZv97YFAk3FGSJUwO7CoWP5EsXL-BJ5e3NlMXUVsvRU7WDnuyxdpd2NGTIISWXQ8kmiUHgeZEuOziyZSJZ6qan5Sa1F_gll5Zedv9E0vLeozcPNOszPZMe-1B65gA"
                      width={36}
                      height={36}
                    />
                  )}
                  <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 ring-2 ring-background-dark animate-pulse"></span>
                </div>
              </button>
              <div
                className={`absolute top-14 right-0 w-56 bg-card-bg/95 backdrop-blur-xl border border-border rounded-lg shadow-2xl overflow-hidden transition-all duration-300 origin-top-right ${
                  showDropdown
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="p-4 border-b border-border">
                  <p className="text-text-muted text-xs mb-1">Signed in as</p>
                  <p className="text-white text-sm font-medium truncate">
                    {session?.user?.email}
                  </p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" }).then(() => alert.success("Signed out successfully."))}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 text-sm font-medium transition-all duration-200 hover:bg-red-500/20 hover:text-red-300 cursor-pointer group"
                  >
                    <span className="material-symbols-outlined text-xl">
                      logout
                    </span>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href={"/auth/signup"}
              className="group relative flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#D4AF37] text-background-dark text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:bg-yellow-600 hover:shadow-lg hover:shadow-[#D4AF37]/50 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 truncate">Sign Up</span>
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
