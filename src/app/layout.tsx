import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prestige Estates | Luxury Real Estate Redefined",
  description: "Discover extraordinary luxury properties worldwide. From oceanfront villas to skyline penthouses, we curate the finest residences for discerning buyers.",
  keywords: ["luxury real estate", "premium homes", "luxury villas", "penthouse", "estate", "high-end property"],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Prestige Estates | Luxury Real Estate Redefined",
    description: "Discover extraordinary luxury properties worldwide. From oceanfront villas to skyline penthouses, we curate the finest residences for discerning buyers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505] text-white`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}