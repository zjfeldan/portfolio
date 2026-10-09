"use client";

import { PanelLeftClose } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { sections, site } from "@/lib/site";
import { useShell } from "./AppShell";

export default function Sidebar() {
  const { collapsed, mobileOpen, sidebarHidden, activeId, toggleSidebar, closeMobile } =
    useShell();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={closeMobile}
        className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="site-sidebar"
        aria-label="Section shortcuts"
        inert={sidebarHidden}
        className={`shell-slide fixed bottom-3 left-3 top-3 z-50 flex w-[76px] flex-col items-center border border-line bg-surface py-4 shadow-[0_24px_50px_-28px_rgb(0_0_0/0.45)] ${
          mobileOpen ? "translate-x-0" : "-translate-x-[calc(100%+1.5rem)]"
        } ${collapsed ? "lg:-translate-x-[calc(100%+1.5rem)]" : "lg:translate-x-0"}`}
      >
        {/* Logo: just the initials, black, lit orange on hover */}
        <a
          href="#about"
          onClick={closeMobile}
          aria-label={`${site.name}, back to top`}
          className="mt-1 grid size-12 place-items-center font-display text-2xl font-black tracking-tight text-ink transition-[color,filter,scale] duration-200 ease-snap hover:scale-105 hover:text-accent hover:drop-shadow-[0_0_8px_rgb(242_90_29/0.6)] active:scale-95"
        >
          {site.initials}
        </a>

        <span aria-hidden="true" className="my-4 h-px w-8 bg-line" />

        <nav aria-label="Sections" className="flex-1">
          <ul className="flex flex-col items-center gap-1.5">
            {sections.map((section) => {
              const Icon = getIcon(section.icon);
              const active = activeId === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={closeMobile}
                    aria-label={section.label}
                    aria-current={active ? "true" : undefined}
                    className="group relative grid size-12 place-items-center text-steel transition-colors duration-200 ease-snap hover:text-accent aria-[current=true]:text-accent"
                  >
                    <Icon
                      aria-hidden="true"
                      className="size-[22px] transition-[scale,filter] duration-200 ease-snap group-hover:scale-110 group-active:scale-90 group-aria-[current=true]:scale-110 group-aria-[current=true]:drop-shadow-[0_0_6px_rgb(242_90_29/0.75)]"
                      strokeWidth={2}
                    />
                    {/* Hover label (desktop) */}
                    <span className="pointer-events-none absolute left-[calc(100%+0.75rem)] top-1/2 -translate-x-1 -translate-y-1/2 whitespace-nowrap bg-ink px-3 py-1 font-hud text-xs font-bold uppercase tracking-wider text-white opacity-0 transition-[opacity,transform] duration-200 ease-snap group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 max-lg:hidden">
                      {section.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Hide sidebar"
          aria-controls="site-sidebar"
          className="grid size-11 place-items-center text-steel transition-[color,filter,scale] duration-200 ease-snap hover:text-accent hover:drop-shadow-[0_0_6px_rgb(242_90_29/0.75)] active:scale-90"
        >
          <PanelLeftClose aria-hidden="true" className="size-5" strokeWidth={2} />
        </button>
      </aside>
    </>
  );
}
