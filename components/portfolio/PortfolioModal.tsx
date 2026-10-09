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
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { SkillIcon } from "@/components/ui/SkillIcon";
import { monthYear } from "@/lib/format";
import type { Project, ProjectCategory } from "@/lib/types";
import { byNewest, byTitle, isImageOnly } from "./ordering";

/** Art galleries sort by title (A–Z / Z–A); the rest by date (newest / oldest) */
type SortOrder = "az" | "za" | "newest" | "oldest";

const SORT_LABEL: Record<SortOrder, string> = { az: "A–Z", za: "Z–A", newest: "Newest", oldest: "Oldest" };
const SORT_FLIP: Record<SortOrder, SortOrder> = { az: "za", za: "az", newest: "oldest", oldest: "newest" };

/**
 * A category's gallery in a native <dialog>:
 * - 3-column grid of A4 cards (2 on phones) that grows as you add entries
 * - Sort button (A–Z / Z–A for art galleries, Newest / Oldest for the rest), and an empty state
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
  const imageOnly = isImageOnly(category);
  const [sort, setSort] = useState<SortOrder>(imageOnly ? "az" : "newest");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const lastOpenedId = useRef<number | null>(null);
  const savedScroll = useRef(0);
  // Width ÷ height of each image, learnt from the gallery thumbnails, so the
  // viewer can pick a portrait or landscape layout before the full image loads
  const ratios = useRef(new Map<number, number>());

  const projects = useMemo(() => {
    const compare = sort === "az" || sort === "za" ? byTitle : byNewest;
    const reverse = sort === "za" || sort === "oldest";
    return [...category.projects].sort((a, b) => (reverse ? -1 : 1) * compare(a, b));
  }, [category.projects, sort]);

  const selectedIndex = projects.findIndex((project) => project.id === selectedId);
  const selected = selectedIndex >= 0 ? projects[selectedIndex] : null;
  const count = projects.length;

  // Backup for Esc when focus isn't inside the gallery content
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
        if (!selected) return;
        // Esc in the detail view: back to the gallery (stops the dialog closing)
        if (event.key === "Escape") {
          event.preventDefault();
          setSelectedId(null);
          return;
        }
        if (count < 2) return;
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
                onClick={() => setSort((value) => SORT_FLIP[value])}
                aria-label={`Sorted ${SORT_LABEL[sort]}. Switch to ${SORT_LABEL[SORT_FLIP[sort]]}`}
                className="group flex h-10 items-center gap-2 px-2 font-hud text-xs font-bold uppercase tracking-wider text-ink transition-colors duration-200 ease-snap hover:text-accent-ink sm:text-sm"
              >
                <ArrowDownUp
                  aria-hidden="true"
                  className={`size-[18px] text-accent drop-shadow-[0_0_6px_rgb(242_90_29/0.6)] transition-transform duration-300 ease-snap ${
                    sort === "oldest" || sort === "za" ? "rotate-180" : ""
                  }`}
                  strokeWidth={2.4}
                />
                {SORT_LABEL[sort]}
                {imageOnly ? null : <span className="max-sm:hidden"> first</span>}
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
          ) : imageOnly ? (
            // Pinterest-style: 4 columns of uneven cards (3 on tablets, 2 on phones)
            <MasonryGrid
              projects={projects}
              renderCard={(project) => (
                <GalleryCard
                  showDate={false}
                  project={project}
                  aspect={cardAspect(project)}
                  onOpen={() => openProject(project.id)}
                  onRatio={(ratio) => ratios.current.set(project.id, ratio)}
                />
              )}
            />
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
              {projects.map((project, i) => (
                <li
                  key={project.id}
                  className="animate-rise"
                  style={{ animationDelay: `${Math.min(i, 11) * 45}ms` }}
                >
                  <GalleryCard
                    showDate={!imageOnly}
                    project={project}
                    onOpen={() => openProject(project.id)}
                    onRatio={(ratio) => ratios.current.set(project.id, ratio)}
                  />
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

          {imageOnly ? (
            <ImageOnlyView key={selected.id} project={selected} />
          ) : (
            <ProjectDetail
              key={selected.id}
              project={selected}
              categoryName={category.name}
              knownRatio={ratios.current.get(selected.id) ?? null}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

/** Masonry card shape: the image's own shape, kept between tall (1:2) and wide (16:10) */
function cardAspect(project: Project): number {
  const { imageWidth: width, imageHeight: height } = project;
  const ratio = width && height ? width / height : 3 / 4;
  return Math.min(Math.max(ratio, 0.5), 1.6);
}

const COLUMN_QUERIES = ["(min-width: 1024px)", "(min-width: 640px)"];

function subscribeToColumns(onChange: () => void) {
  const lists = COLUMN_QUERIES.map((query) => window.matchMedia(query));
  lists.forEach((list) => list.addEventListener("change", onChange));
  return () => lists.forEach((list) => list.removeEventListener("change", onChange));
}

function currentColumns() {
  if (window.matchMedia(COLUMN_QUERIES[0]).matches) return 4;
  if (window.matchMedia(COLUMN_QUERIES[1]).matches) return 3;
  return 2;
}

/**
 * Pinterest-style layout. Each card goes into the currently shortest
 * column, so the feed reads left to right in the current sort order while the
 * columns stay roughly even, whatever mix of portrait and landscape.
 */
function MasonryGrid({
  projects,
  renderCard,
}: {
  projects: Project[];
  renderCard: (project: Project) => React.ReactNode;
}) {
  const columnCount = useSyncExternalStore(subscribeToColumns, currentColumns, () => 4);

  const columns = useMemo(() => {
    const result = Array.from({ length: columnCount }, () => ({
      height: 0,
      items: [] as { project: Project; index: number }[],
    }));
    projects.forEach((project, index) => {
      const shortest = result.reduce((a, b) => (b.height < a.height ? b : a));
      shortest.items.push({ project, index });
      shortest.height += 1 / cardAspect(project);
    });
    return result;
  }, [projects, columnCount]);

  return (
    <div className="flex items-start gap-3 sm:gap-4">
      {columns.map((column, c) => (
        <ul key={c} className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
          {column.items.map(({ project, index }) => (
            <li
              key={project.id}
              className="animate-rise"
              style={{ animationDelay: `${Math.min(index, 15) * 35}ms` }}
            >
              {renderCard(project)}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

function GalleryCard({
  project,
  showDate,
  aspect,
  onOpen,
  onRatio,
}: {
  project: Project;
  /** false = title only on hover */
  showDate: boolean;
  /** Card width ÷ height for the masonry; leave out for the standard A4 card */
  aspect?: number;
  onOpen: () => void;
  onRatio: (ratio: number) => void;
}) {
  const date = showDate ? monthYear(project.completedOn) : null;
  return (
    <button
      type="button"
      data-project-id={project.id}
      onClick={onOpen}
      aria-label={`${project.title}${date ? `, ${date}` : ""}. View details`}
      style={aspect ? { aspectRatio: aspect } : undefined}
      className={`group relative block w-full overflow-hidden bg-shade ${aspect ? "" : "aspect-[210/297]"} shadow-[0_14px_28px_-20px_rgb(0_0_0/0.6)] transition-[translate,box-shadow] duration-300 ease-snap hover:-translate-y-1 hover:shadow-[0_0_0_2px_var(--color-accent),0_22px_40px_-18px_rgb(242_90_29/0.55)] focus-visible:-translate-y-1 focus-visible:shadow-[0_0_0_2px_var(--color-accent),0_22px_40px_-18px_rgb(242_90_29/0.55)] focus-visible:outline-none`}
    >
      {/* Any image size fills the A4 card: scaled up and centred, edges trimmed */}
      {project.imageUrl ? (
        <Image
          src={project.imageUrl}
          alt=""
          fill
          quality={90}
          sizes={
            aspect
              ? "(min-width: 1100px) 260px, (min-width: 1024px) 24vw, (min-width: 640px) 31vw, 46vw"
              : "(min-width: 1100px) 340px, (min-width: 640px) 31vw, 46vw"
          }
          onLoad={(event) => {
            const img = event.currentTarget;
            if (img.naturalHeight) onRatio(img.naturalWidth / img.naturalHeight);
          }}
          className="object-cover object-center transition-[scale] duration-500 ease-snap group-hover:scale-[1.04]"
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-[repeating-linear-gradient(135deg,rgb(255_255_255/0.04)_0_1px,transparent_1px_10px)]">
          <ImageIcon aria-hidden="true" className="size-10 text-white/20" strokeWidth={1.5} />
        </div>
      )}

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

/** Art categories: just the full image, fitted inside, with its title underneath */
function ImageOnlyView({ project }: { project: Project }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#141414]">
      <div className="animate-wipe relative min-h-0 flex-1">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.imageAlt ?? project.title}
            fill
          quality={90}
            sizes="(min-width: 1100px) 1100px, 100vw"
            className="object-contain object-center p-2 sm:p-5"
          />
        ) : (
          <div className="grid h-full place-items-center">
            <ImageIcon aria-hidden="true" className="size-14 text-white/20" strokeWidth={1.4} />
          </div>
        )}
      </div>
      <h3 className="animate-rise shrink-0 border-t border-white/10 px-5 py-3 text-center font-display text-sm font-extrabold uppercase leading-snug tracking-tight text-white sm:py-4 sm:text-base">
        {project.title}
      </h3>
    </div>
  );
}

function ProjectDetail({
  project,
  categoryName,
  knownRatio,
}: {
  project: Project;
  categoryName: string;
  /** Width ÷ height if the gallery already loaded this image */
  knownRatio: number | null;
}) {
  const date = monthYear(project.completedOn);
  const [ratio, setRatio] = useState<number | null>(knownRatio);
  // Wider than about 6:5 counts as landscape
  const landscape = ratio !== null && ratio > 1.2;

  return (
    <div
      className={`grid min-h-0 flex-1 grid-cols-1 content-start overflow-y-auto ${
        landscape ? "" : "md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:content-stretch md:overflow-hidden"
      }`}
    >
      {/* Viewer: the whole image always fits inside, never cropped or zoomed.
          Spare space around it shows as dark bars. Portrait images sit beside
          the details; landscape images go full width above them. */}
      <div
        style={{ "--ratio": ratio ?? 210 / 297 } as React.CSSProperties}
        className={`animate-wipe relative w-full shrink-0 bg-[#141414] ${
          landscape
            ? "aspect-[var(--ratio)] max-h-[min(58dvh,560px)]"
            : "aspect-[var(--ratio)] max-h-[70dvh] md:aspect-auto md:h-full md:max-h-none"
        }`}
      >
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.imageAlt ?? project.title}
            fill
          quality={90}
            sizes={landscape ? "(min-width: 1100px) 1100px, 100vw" : "(min-width: 768px) 600px, 100vw"}
            onLoad={(event) => {
              const img = event.currentTarget;
              if (img.naturalHeight) setRatio(img.naturalWidth / img.naturalHeight);
            }}
            className="object-contain object-center p-2 sm:p-4"
          />
        ) : (
          <div className="grid h-full place-items-center">
            <ImageIcon aria-hidden="true" className="size-14 text-white/20" strokeWidth={1.4} />
          </div>
        )}
      </div>

      <div className={`animate-rise flex flex-col p-5 sm:p-7 ${landscape ? "" : "md:overflow-y-auto"}`}>
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
