import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "material-symbols/outlined.css";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Providers from "@/components/Providers";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Ilm Space",
  description: "Your personal space for Islamic Deep Study.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${lexend.variable} font-display antialiased bg-background-dark text-white`}
      >
        <div className="relative min-h-screen w-full">
          <div className="absolute inset-0 islamic-pattern opacity-10"></div>
          <div className="relative z-10">
            <Providers>
              <Navbar />
              {children}
            </Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
