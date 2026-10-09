import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Montserrat } from "next/font/google";
import AppShell from "@/components/shell/AppShell";
import { site } from "@/lib/site";
import "./globals.css";

// Names, titles and body text: heavy geometric sans
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"] });

// HUD details (nav, buttons, tags, counters): squared, technical
const chakra = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: "#e9e9e6",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${chakra.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
