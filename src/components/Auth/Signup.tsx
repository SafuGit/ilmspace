"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      signIn('email', { email }).then(() => {
        console.log("Signed up.")
      })
    } catch {
      throw "An error occured."
    }
    console.log("Sending magic link to:", email);
  };

  const handleDiscordLogin = () => {
    try {
      signIn('discord').then(() => {
        console.log("Signed up with discord")
      })
    } catch {
      throw "An error occured."
    }
    console.log("Discord login clicked");
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-3xl animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-3xl animate-[float_8s_ease-in-out_infinite]" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-[#D4AF37]/5 blur-2xl animate-[float_7s_ease-in-out_infinite]" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="layout-container flex h-full grow flex-col relative z-10">

        {/* Main Content */}
        <div className="flex flex-1 items-center justify-center px-4 py-5 sm:px-6 lg:px-8">
          <div className="relative w-full max-w-lg animate-[scaleIn_0.6s_ease-out]">
            {/* Decorative background blurs with animation */}
            <div className="absolute -top-16 -left-20 h-40 w-40 rounded-full bg-[#D4AF37]/20 blur-2xl animate-[pulse_3s_ease-in-out_infinite]"></div>
            <div className="absolute -bottom-16 -right-20 h-40 w-40 rounded-full bg-[#D4AF37]/20 blur-2xl animate-[pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '1.5s' }}></div>

            {/* Sign up card */}
            <div className="relative z-10 w-full overflow-hidden rounded-2xl border border-border bg-background-dark/50 backdrop-blur-sm transition-all duration-500 hover:border-[#D4AF37]/30 hover:shadow-2xl hover:shadow-[#D4AF37]/10">
              <div className="absolute inset-0 bg-linear-to-br from-[#D4AF37]/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
              <div className="flex flex-col items-center gap-6 p-8 sm:p-10 relative z-10">
                {/* Decorative top accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-24 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent animate-[pulse_2s_ease-in-out_infinite]"></div>
                
                {/* Header */}
                <div className="text-center animate-[fadeInDown_0.8s_ease-out]">
                  <div className="inline-flex items-center justify-center size-16 rounded-full bg-border text-[#D4AF37] mb-4 animate-[glow_3s_ease-in-out_infinite]">
                    <span className="material-symbols-outlined text-3xl">auto_stories</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Login to Ilmspace
                  </h2>
                  <p className="mt-2 text-base text-text-muted">
                    Join IlmSpace to begin your journey of knowledge.
                  </p>
                </div>

                {/* Form */}
                <div className="w-full space-y-4 animate-[fadeInUp_1s_ease-out]">
                  <form
                    onSubmit={handleMagicLinkSubmit}
                    className="flex flex-col gap-4"
                  >
                    <label className="sr-only" htmlFor="email">
                      Email
                    </label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-[#D4AF37]">mail</span>
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border bg-card-bg text-white placeholder:text-text-muted focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 h-14 pl-12 pr-4 text-base font-normal leading-normal transition-all hover:border-[#D4AF37]/50"
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 flex-1 bg-[#D4AF37] text-background-dark text-base font-bold leading-normal tracking-[-0.015em] transition-all hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-[#D4AF37]/50 hover:scale-105 active:scale-95 py-2"
                    >
                      <span className="material-symbols-outlined transition-transform group-hover:rotate-12">
                        {isLoading ? 'hourglass_empty' : 'send'}
                      </span>
                      <span className="truncate relative z-10">
                        {isLoading ? "Sending..." : "Send Login Link"}
                      </span>
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-4">
                    <hr className="w-full border-t border-border" />
                    <p className="text-sm font-normal leading-normal text-text-muted">
                      or
                    </p>
                    <hr className="w-full border-t border-border" />
                  </div>

                  {/* Discord Login */}
                  <button
                    onClick={handleDiscordLogin}
                    className="flex w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 flex-1 bg-border text-white gap-2 pl-4 text-base font-bold leading-normal tracking-[-0.015em] transition-all hover:bg-border/80 hover:shadow-lg"
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
                  <p className="text-xs text-center text-text-muted mt-4">
                    By signing up or logging in, you agree to our{" "}
                    <Link href="/terms" className="text-[#D4AF37] hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-[#D4AF37] hover:underline"
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
