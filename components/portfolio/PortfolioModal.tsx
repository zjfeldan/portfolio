"use client";

import {
  ArrowDownUp,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  PackageOpen,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AssetSlot } from "@/components/ui/AssetSlot";
import { SkillIcon } from "@/components/ui/SkillIcon";
import { monthYear } from "@/lib/format";
import type { Project, ProjectCategory } from "@/lib/types";

type SortOrder = "newest" | "oldest";

/**
 * A category's gallery in a native <dialog>:
 * - 3-column grid of A4 cards (2 on phones) that grows as you add entries
 * - Newest / Oldest sort, and an empty state
 * - Clicking a card shows the whole image with its details, tools and link
 * Esc in the detail view goes back to the gallery; Esc again closes.
 */
export function PortfolioModal({
  category,
  onClose,
}: {
  category: ProjectCategory | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = category !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={category ? `${category.name} gallery` : undefined}
      onClose={onClose}
      // A click on the dimmed backdrop lands on the dialog element itself
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      className="project-modal m-auto h-[min(880px,calc(100dvh-1.5rem))] max-h-none w-[calc(100%-1.5rem)] max-w-[1100px] overflow-hidden border border-line bg-surface p-0 text-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]"
    >
      {category ? (
        // key: a fresh gallery (sort, scroll, selection) each time a category opens
        <Gallery
          key={category.id}
          category={category}
          dialogRef={dialogRef}
          close={() => dialogRef.current?.close()}
        />
      ) : null}
    </dialog>
  );
}

function Gallery({
  category,
  dialogRef,
  close,
}: {
  category: ProjectCategory;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  close: () => void;
}) {
  const [sort, setSort] = useState<SortOrder>("newest");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const lastOpenedId = useRef<number | null>(null);
  const savedScroll = useRef(0);

  const projects = useMemo(() => {
    const direction = sort === "newest" ? -1 : 1;
    return [...category.projects].sort(
      (a, b) =>
        direction * (a.completedOn.localeCompare(b.completedOn) || a.id - b.id),
    );
  }, [category.projects, sort]);

  const selectedIndex = projects.findIndex((project) => project.id === selectedId);
  const selected = selectedIndex >= 0 ? projects[selectedIndex] : null;
  const count = projects.length;

  // Esc in the detail view: back to the gallery instead of closing
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = (event: Event) => {
      if (selectedId !== null) {
        event.preventDefault();
        setSelectedId(null);
      }
    };
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [dialogRef, selectedId]);

  // Move keyboard focus sensibly between the two views
  useEffect(() => {
    if (selectedId !== null) {
      backRef.current?.focus();
    } else if (lastOpenedId.current !== null && listRef.current) {
      // Back in the gallery: same scroll position, focus on the card you opened
      listRef.current.scrollTop = savedScroll.current;
      listRef.current
        .querySelector<HTMLButtonElement>(`[data-project-id="${lastOpenedId.current}"]`)
        ?.focus({ preventScroll: true });
    }
  }, [selectedId]);

  const openProject = (id: number) => {
    savedScroll.current = listRef.current?.scrollTop ?? 0;
    lastOpenedId.current = id;
    setSelectedId(id);
  };

  const step = (direction: 1 | -1) => {
    if (selectedIndex < 0) return;
    const next = projects[(selectedIndex + direction + count) % count];
    lastOpenedId.current = next.id;
    setSelectedId(next.id);
  };

  return (
    <div
      className="flex h-full flex-col"
      onKeyDown={(event) => {
        if (!selected || count < 2) return;
        if (event.key === "ArrowRight") step(1);
        if (event.key === "ArrowLeft") step(-1);
      }}
    >
      {/* ---------------- Gallery view (kept mounted to remember scroll) ---------------- */}
      <div className={`min-h-0 flex-1 flex-col ${selected ? "hidden" : "flex"}`}>
        <header className="flex items-center justify-between gap-3 border-b border-line py-3 pl-5 pr-3 sm:py-4 sm:pl-7 sm:pr-5">
          <div className="min-w-0">
            <p className="font-hud text-[11px] font-semibold uppercase tracking-[0.16em] text-steel sm:text-xs">
              Portfolio · {count} {count === 1 ? "entry" : "entries"}
            </p>
            <h2 className="mt-1 font-display text-xl font-black uppercase leading-none tracking-tight sm:text-3xl">
              {category.name}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            {count > 1 ? (
              <button
                type="button"
                onClick={() => setSort((value) => (value === "newest" ? "oldest" : "newest"))}
                aria-label={`Sorted ${sort} first. Switch to ${sort === "newest" ? "oldest" : "newest"} first`}
                className="group flex h-10 items-center gap-2 px-2 font-hud text-xs font-bold uppercase tracking-wider text-ink transition-colors duration-200 ease-snap hover:text-accent-ink sm:text-sm"
              >
                <ArrowDownUp
                  aria-hidden="true"
                  className={`size-[18px] text-accent drop-shadow-[0_0_6px_rgb(242_90_29/0.6)] transition-transform duration-300 ease-snap ${
                    sort === "oldest" ? "rotate-180" : ""
                  }`}
                  strokeWidth={2.4}
                />
                {sort === "newest" ? "Newest" : "Oldest"}
                <span className="max-sm:hidden"> first</span>
              </button>
            ) : null}
            <IconButton label="Close gallery" onClick={close}>
              <X aria-hidden="true" className="size-6" strokeWidth={2.4} />
            </IconButton>
          </div>
        </header>

        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-6">
          {count === 0 ? (
            <EmptyState />
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
              {projects.map((project, i) => (
                <li
                  key={project.id}
                  className="animate-rise"
                  style={{ animationDelay: `${Math.min(i, 11) * 45}ms` }}
                >
                  <GalleryCard project={project} onOpen={() => openProject(project.id)} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ---------------- Detail view ---------------- */}
      {selected ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-2 border-b border-line py-2 pl-2 pr-3 sm:pl-4 sm:pr-5">
            <button
              ref={backRef}
              type="button"
              onClick={() => setSelectedId(null)}
              className="group flex h-10 min-w-0 items-center gap-1 pr-2 font-hud text-xs font-bold uppercase tracking-wider text-ink transition-colors duration-200 ease-snap hover:text-accent-ink sm:text-sm"
            >
              <ChevronLeft
                aria-hidden="true"
                className="size-6 shrink-0 text-accent drop-shadow-[0_0_6px_rgb(242_90_29/0.6)] transition-transform duration-200 ease-snap group-hover:-translate-x-0.5"
                strokeWidth={2.6}
              />
              <span className="truncate">
                Back<span className="max-sm:hidden"> to {category.name}</span>
              </span>
            </button>

            <div className="flex shrink-0 items-center gap-1">
              {count > 1 ? (
                <>
                  <p className="mr-1 font-hud text-ink" aria-live="polite">
                    <span className="text-lg font-bold leading-none">{pad(selectedIndex + 1)}</span>
                    <span className="text-xs font-semibold text-steel"> / {pad(count)}</span>
                  </p>
                  <IconButton label="Previous entry" onClick={() => step(-1)} glow>
                    <ChevronLeft aria-hidden="true" className="size-7" strokeWidth={2.6} />
                  </IconButton>
                  <IconButton label="Next entry" onClick={() => step(1)} glow>
                    <ChevronRight aria-hidden="true" className="size-7" strokeWidth={2.6} />
                  </IconButton>
                </>
              ) : null}
              <IconButton label="Close gallery" onClick={close}>
                <X aria-hidden="true" className="size-6" strokeWidth={2.4} />
              </IconButton>
            </div>
          </header>

          <ProjectDetail key={selected.id} project={selected} categoryName={category.name} />
        </div>
      ) : null}
    </div>
  );
}

function GalleryCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const date = monthYear(project.completedOn);
  return (
    <button
      type="button"
      data-project-id={project.id}
      onClick={onOpen}
      aria-label={`${project.title}${date ? `, ${date}` : ""}. View details`}
      className="group relative block aspect-[210/297] w-full overflow-hidden bg-shade shadow-[0_14px_28px_-20px_rgb(0_0_0/0.6)] transition-[translate,box-shadow] duration-300 ease-snap hover:-translate-y-1 hover:shadow-[0_0_0_2px_var(--color-accent),0_22px_40px_-18px_rgb(242_90_29/0.55)] focus-visible:-translate-y-1 focus-visible:shadow-[0_0_0_2px_var(--color-accent),0_22px_40px_-18px_rgb(242_90_29/0.55)] focus-visible:outline-none"
    >
      <AssetSlot
        src={project.imageUrl}
        alt=""
        sizes="(min-width: 1100px) 340px, (min-width: 640px) 31vw, 46vw"
        className="h-full w-full"
        imageClassName="object-cover transition-[scale] duration-500 ease-snap group-hover:scale-[1.04]"
      >
        <div className="grid h-full w-full place-items-center bg-[repeating-linear-gradient(135deg,rgb(255_255_255/0.04)_0_1px,transparent_1px_10px)]">
          <ImageIcon aria-hidden="true" className="size-10 text-white/20" strokeWidth={1.5} />
        </div>
      </AssetSlot>

      {/* Title on hover (always shown on touch screens, which have no hover) */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-linear-to-t from-ink/90 via-ink/55 to-transparent p-3 pt-12 text-left opacity-0 transition-[opacity,translate] duration-300 ease-snap group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100 sm:p-4 sm:pt-14">
        <span className="line-clamp-2 block font-display text-[13px] font-extrabold uppercase leading-tight text-white sm:text-sm">
          {project.title}
        </span>
        {date ? (
          <span className="mt-1 block font-hud text-[11px] font-semibold uppercase tracking-wider text-white/70">
            {date}
          </span>
        ) : null}
      </span>
    </button>
  );
}

function ProjectDetail({ project, categoryName }: { project: Project; categoryName: string }) {
  const date = monthYear(project.completedOn);
  return (
    <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:overflow-hidden">
      {/* The whole image, never cropped */}
      <div className="animate-wipe relative h-[62dvh] bg-sunken md:h-full">
        <AssetSlot
          src={project.imageUrl}
          alt={project.imageAlt ?? project.title}
          sizes="(min-width: 768px) 600px, 100vw"
          className="h-full w-full"
          imageClassName="object-contain p-3 sm:p-6"
        >
          <div className="flex h-full items-center justify-center p-3 sm:p-6">
            <div className="grid aspect-[210/297] h-full place-items-center bg-shade">
              <ImageIcon aria-hidden="true" className="size-14 text-white/20" strokeWidth={1.4} />
            </div>
          </div>
        </AssetSlot>
      </div>

      <div className="animate-rise flex flex-col p-5 sm:p-7 md:overflow-y-auto">
        <span className="w-fit bg-accent px-2.5 py-1 font-hud text-xs font-bold uppercase tracking-wider text-ink">
          {categoryName}
        </span>
        <h3 className="mt-4 font-display text-2xl font-black uppercase leading-[0.95] tracking-tight sm:text-3xl">
          {project.title}
        </h3>
        {date ? (
          <p className="mt-2 font-hud text-xs font-semibold uppercase tracking-wider text-steel">{date}</p>
        ) : null}

        {project.description ? (
          <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-graphite">
            {project.description}
          </p>
        ) : null}

        {project.tools.length > 0 ? (
          <div className="mt-6">
            <p className="font-hud text-xs font-bold uppercase tracking-wider text-accent-ink">Tools used</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {project.tools.map((tool) => (
                <li
                  key={tool.name}
                  className="flex items-center gap-1.5 border border-line px-2 py-1 font-hud text-xs font-semibold uppercase tracking-wide text-ink"
                >
                  <SkillIcon iconKey={tool.iconKey} iconUrl={tool.iconUrl} size={14} className="text-accent" />
                  {tool.name}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {project.projectUrl ? (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 flex w-fit items-center gap-2 border-2 border-ink bg-ink px-5 py-2.5 font-hud text-sm font-bold uppercase tracking-wider text-white transition-[background-color,border-color,color,box-shadow] duration-200 ease-snap hover:border-accent hover:bg-accent hover:text-ink hover:shadow-[0_0_24px_-4px_rgb(242_90_29/0.8)] active:animate-bloom"
          >
            See more
            <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={2.4} />
          </a>
        ) : null}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid h-full min-h-[300px] place-items-center text-center">
      <div className="flex flex-col items-center gap-4">
        <PackageOpen aria-hidden="true" className="size-20 text-line" strokeWidth={1.3} />
        <p className="font-hud text-sm font-bold uppercase tracking-[0.16em] text-steel">Nothing to show here</p>
      </div>
    </div>
  );
}

/** Icon-only button: just the icon, lit orange on hover (or always, with `glow`) */
function IconButton({
  label,
  onClick,
  glow = false,
  children,
}: {
  label: string;
  onClick: () => void;
  glow?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`grid size-10 shrink-0 place-items-center transition-[color,filter,scale] duration-200 ease-snap hover:scale-110 active:scale-90 ${
        glow
          ? "text-accent drop-shadow-[0_0_6px_rgb(242_90_29/0.75)] hover:drop-shadow-[0_0_10px_rgb(242_90_29/0.9)]"
          : "text-ink hover:text-accent hover:drop-shadow-[0_0_6px_rgb(242_90_29/0.75)]"
      }`}
    >
      {children}
    </button>
  );
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}
