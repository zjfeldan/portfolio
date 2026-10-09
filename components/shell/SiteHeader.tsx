"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { sections, site } from "@/lib/site";
import { useShell } from "./AppShell";

export default function SiteHeader() {
  const { collapsed, sidebarHidden, activeId, toggleSidebar } = useShell();
  const ToggleIcon = sidebarHidden ? PanelLeftOpen : PanelLeftClose;

  return (
    <header
      className={`shell-shift fixed inset-x-0 top-3 z-30 px-3 sm:px-4 ${
        collapsed ? "lg:pl-4" : "lg:pl-[104px]"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between gap-3 border border-line bg-surface/95 pl-2 pr-3 shadow-[0_18px_40px_-30px_rgb(0_0_0/0.5)] backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-controls="site-sidebar"
            aria-expanded={!sidebarHidden}
            aria-label={sidebarHidden ? "Show sidebar" : "Hide sidebar"}
            className="grid size-10 shrink-0 place-items-center text-ink transition-[color,filter,scale] duration-200 ease-snap hover:text-accent hover:drop-shadow-[0_0_6px_rgb(242_90_29/0.75)] active:scale-90"
          >
            <ToggleIcon aria-hidden="true" className="size-5" strokeWidth={2} />
          </button>
          <a
            href="#about"
            className="truncate font-display text-[15px] font-extrabold uppercase tracking-tight text-ink transition-colors duration-200 hover:text-accent-ink"
          >
            {site.shortName}
          </a>
        </div>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={activeId === section.id ? "true" : undefined}
                  className="group relative block px-3 py-2 font-hud text-[13px] font-semibold uppercase tracking-wider text-steel transition-colors duration-200 ease-snap hover:text-ink aria-[current=true]:text-ink"
                >
                  {section.label}
                  {/* A dot marks the active section */}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 scale-0 rounded-full bg-accent transition-transform duration-200 ease-snap group-aria-[current=true]:scale-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#contact"
          className="bg-accent px-4 py-2 font-hud text-sm font-bold uppercase tracking-wider text-ink shadow-[0_0_18px_-4px_rgb(242_90_29/0.7)] transition-[box-shadow] duration-200 ease-snap hover:shadow-[0_0_26px_-2px_rgb(242_90_29/0.9)] active:animate-bloom md:hidden"
        >
          Contact
        </a>
      </div>
    </header>
  );
}
