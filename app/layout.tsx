import type { Metadata, Viewport } from "next";
import { Figtree, Unbounded } from "next/font/google";
import AppShell from "@/components/shell/AppShell";
import { site } from "@/lib/site";
import "./globals.css";

// Display face: wide and heavy, for names and section titles
const display = Unbounded({ variable: "--font-unbounded", subsets: ["latin"] });

// Body face: clean and readable at small sizes
const body = Figtree({ variable: "--font-figtree", subsets: ["latin"] });

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: "#10143a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
