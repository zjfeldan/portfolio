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
      <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between gap-3 rounded-full bg-frame/80 pl-2 pr-2 shadow-[0_18px_40px_-24px_rgb(0_0_0/0.8)] ring-1 ring-line/60 backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-controls="site-sidebar"
            aria-expanded={!sidebarHidden}
            aria-label={sidebarHidden ? "Show sidebar" : "Hide sidebar"}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-raised/70 text-ink transition-[background-color,transform] duration-500 ease-juice hover:scale-105 hover:bg-raised active:scale-90"
          >
            <ToggleIcon aria-hidden="true" className="size-5" strokeWidth={2.2} />
          </button>
          <a
            href="#about"
            className="truncate font-display text-sm font-bold tracking-tight text-ink transition-colors hover:text-cyan"
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
                  className="block rounded-full px-3.5 py-2 text-[13px] font-semibold text-mist transition-[background-color,color,transform] duration-500 ease-juice hover:-translate-y-px hover:bg-raised/70 hover:text-ink active:scale-95 aria-[current=true]:bg-cyan aria-[current=true]:text-night"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#contact"
          className="rounded-full bg-cyan px-4 py-2 text-sm font-bold text-night transition-transform duration-500 ease-juice hover:scale-105 active:scale-95 md:hidden"
        >
          Contact
        </a>
      </div>
    </header>
  );
}
