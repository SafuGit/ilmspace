"use client";

import { useState } from "react";
import Link from "next/link";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Sending magic link to:", email);
  };

  const handleDiscordLogin = () => {
    // TODO: Implement Discord OAuth
    console.log("Discord login clicked");
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111318] overflow-x-hidden">
      {/* Background blur effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#292e38]/20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="layout-container flex h-full grow flex-col relative z-10">

        {/* Main Content */}
        <div className="flex flex-1 items-center justify-center px-4 py-5 sm:px-6 lg:px-8">
          <div className="relative w-full max-w-lg">
            {/* Decorative background blurs */}
            <div className="absolute -top-16 -left-20 h-40 w-40 rounded-full bg-primary/20 blur-2xl"></div>
            <div className="absolute -bottom-16 -right-20 h-40 w-40 rounded-full bg-[#292e38]/40 blur-2xl"></div>

            {/* Sign up card */}
            <div className="relative z-10 w-full overflow-hidden rounded-2xl border border-[#292e38] bg-[#111318]/50 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-6 p-8 sm:p-10">
                {/* Header */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Create your account
                  </h2>
                  <p className="mt-2 text-base text-[#9da6b8]">
                    Join IlmSpace to begin your journey of knowledge.
                  </p>
                </div>

                {/* Form */}
                <div className="w-full space-y-4">
                  <form
                    onSubmit={handleMagicLinkSubmit}
                    className="flex flex-col gap-4"
                  >
                    <label className="sr-only" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-[#292e38] bg-[#1f2329] text-white placeholder:text-[#9da6b8] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 h-14 p-4 text-base font-normal leading-normal transition-all"
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 flex-1 bg-primary text-white text-base font-bold leading-normal tracking-[-0.015em] transition-all hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/50 py-2"
                    >
                      <span className="truncate">
                        {isLoading ? "Sending..." : "Send Magic Link"}
                      </span>
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-4">
                    <hr className="w-full border-t border-[#292e38]" />
                    <p className="text-sm font-normal leading-normal text-[#9da6b8]">
                      or
                    </p>
                    <hr className="w-full border-t border-[#292e38]" />
                  </div>

                  {/* Discord Login */}
                  <button
                    onClick={handleDiscordLogin}
                    className="flex w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 flex-1 bg-[#292e38] text-white gap-2 pl-4 text-base font-bold leading-normal tracking-[-0.015em] transition-all hover:bg-[#343a46] hover:shadow-lg"
                  >
                    <div className="text-white">
                      <svg
                        fill="currentColor"
                        height="20px"
                        viewBox="0 0 256 256"
                        width="20px"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M104,140a12,12,0,1,1-12-12A12,12,0,0,1,104,140Zm60-12a12,12,0,1,0,12,12A12,12,0,0,0,164,128Zm74.45,64.9-67,29.71a16.17,16.17,0,0,1-21.71-9.1l-8.11-22q-6.72.45-13.63.46t-13.63-.46l-8.11,22a16.18,16.18,0,0,1-21.71,9.1l-67-29.71a15.93,15.93,0,0,1-9.06-18.51L38,58A16.07,16.07,0,0,1,51,46.14l36.06-5.93a16.22,16.22,0,0,1,18.26,11.88l3.26,12.84Q118.11,64,128,64t19.4.93l3.26-12.84a16.21,16.21,0,0,1,18.26-11.88L205,46.14A16.07,16.07,0,0,1,218,58l29.53,116.38A15.93,15.93,0,0,1,238.45,192.9ZM232,178.28,202.47,62s0,0-.08,0L166.33,56a.17.17,0,0,0-.17,0l-2.83,11.14c5,.94,10,2.06,14.83,3.42A8,8,0,0,1,176,86.31a8.09,8.09,0,0,1-2.16-.3A172.25,172.25,0,0,0,128,80a172.25,172.25,0,0,0-45.84,6,8,8,0,1,1-4.32-15.4c4.82-1.36,9.78-2.48,14.82-3.42L89.83,56s0,0-.12,0h0L53.61,61.93a.17.17,0,0,0-.09,0L24,178.33,91,208a.23.23,0,0,0,.22,0L98,189.72a173.2,173.2,0,0,1-20.14-4.32A8,8,0,0,1,82.16,170,171.85,171.85,0,0,0,128,176a171.85,171.85,0,0,0,45.84-6,8,8,0,0,1,4.32,15.41A173.2,173.2,0,0,1,158,189.72L164.75,208a.22.22,0,0,0,.21,0Z"></path>
                      </svg>
                    </div>
                    <span className="truncate">Log in with Discord</span>
                  </button>

                  {/* Terms */}
                  <p className="text-xs text-center text-[#9da6b8] mt-4">
                    By signing up, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
