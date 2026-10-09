import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zach Feldan | Portfolio",
  description: "Multimedia, game art and IT work by Zach Feldan.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100`}
      >
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
