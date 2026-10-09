"use client";

import Image from "next/image";
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
        className={`fixed inset-0 z-40 bg-night/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="site-sidebar"
        aria-label="Section shortcuts"
        inert={sidebarHidden}
        className={`shell-slide fixed bottom-3 left-3 top-3 z-50 flex w-[76px] flex-col items-center rounded-[28px] bg-frame/95 py-4 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)] ring-1 ring-line/70 backdrop-blur-md ${
          mobileOpen ? "translate-x-0" : "-translate-x-[calc(100%+1.5rem)]"
        } ${collapsed ? "lg:-translate-x-[calc(100%+1.5rem)]" : "lg:translate-x-0"}`}
      >
        {/* Avatar */}
        <a
          href="#about"
          onClick={closeMobile}
          aria-label={`${site.name}, back to top`}
          className="group relative grid size-12 place-items-center overflow-hidden rounded-2xl bg-linear-to-br from-blush to-lilac font-display text-sm font-bold text-night shadow-[0_8px_20px_-6px_rgb(255_143_177/0.6)] transition-transform duration-500 ease-juice hover:-rotate-6 hover:scale-110 active:scale-95"
        >
          {site.avatarSrc ? (
            <Image src={site.avatarSrc} alt="" fill sizes="48px" className="object-cover" />
          ) : (
            site.initials
          )}
        </a>

        <span aria-hidden="true" className="my-4 h-px w-8 bg-line" />

        <nav aria-label="Sections" className="flex-1">
          <ul className="flex flex-col items-center gap-2">
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
                    className="group relative grid size-12 place-items-center rounded-2xl text-mist transition-[background-color,color,transform,box-shadow] duration-500 ease-juice hover:-translate-y-0.5 hover:bg-raised hover:text-ink active:scale-90 aria-[current=true]:bg-cyan aria-[current=true]:text-night aria-[current=true]:shadow-[0_8px_22px_-8px_rgb(91_224_255/0.8)]"
                  >
                    <Icon
                      aria-hidden="true"
                      className="size-5 transition-transform duration-500 ease-juice group-hover:-rotate-6 group-hover:scale-115"
                      strokeWidth={2.2}
                    />
                    {/* Hover label (desktop) */}
                    <span className="pointer-events-none absolute left-[calc(100%+0.75rem)] top-1/2 -translate-x-1 -translate-y-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-xs font-semibold text-night opacity-0 shadow-lg transition-[opacity,transform] duration-300 ease-out-soft group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 max-lg:hidden">
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
          className="grid size-11 place-items-center rounded-2xl text-mist transition-[background-color,color,transform] duration-500 ease-juice hover:bg-raised hover:text-ink active:scale-90"
        >
          <PanelLeftClose aria-hidden="true" className="size-5" strokeWidth={2.2} />
        </button>
      </aside>
    </>
  );
}
