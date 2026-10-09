"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, useEffect, useRef, useState } from "react";

/**
 * Horizontal, swipeable row that snaps to each item. Arrow buttons appear
 * only when there is more to scroll in that direction. With `counter`,
 * a HUD-style "02/06" readout shows the first visible item.
 */
export function Rail({
  label,
  counter = false,
  className = "",
  trackClassName = "",
  children,
}: {
  /** Read by screen readers, e.g. "Projects" */
  label: string;
  counter?: boolean;
  className?: string;
  trackClassName?: string;
  children: React.ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: true });
  const [index, setIndex] = useState(0);
  const total = Children.count(children);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      const atStart = track.scrollLeft <= 2;
      const atEnd = track.scrollLeft >= max;
      setEdges((prev) =>
        prev.atStart === atStart && prev.atEnd === atEnd ? prev : { atStart, atEnd },
      );

      // First item whose left edge is at or past the scroll position
      const items = Array.from(track.children) as HTMLElement[];
      const start = track.getBoundingClientRect().left;
      let current = items.findIndex((item) => item.getBoundingClientRect().left >= start - 8);
      if (atEnd) current = items.length - 1;
      setIndex(current < 0 ? 0 : current);
    };

    const resize = new ResizeObserver(update);
    resize.observe(track);
    track.addEventListener("scroll", update, { passive: true });
    return () => {
      resize.disconnect();
      track.removeEventListener("scroll", update);
    };
  }, []);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  // Fade the edge(s) that have more content, so the arrow icons stay readable
  const left = edges.atStart ? "#000 0" : "transparent 36px, #000 120px";
  const right = edges.atEnd ? "#000 100%" : "#000 calc(100% - 120px), transparent calc(100% - 36px)";
  const mask = `linear-gradient(90deg, ${left}, ${right})`;

  return (
    <div className={className}>
      <div className="relative">
        <div
          ref={trackRef}
          role="region"
          aria-label={label}
          tabIndex={0}
          style={{ maskImage: mask, WebkitMaskImage: mask }}
          className={`no-scrollbar relative -mx-1 -my-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-1 px-1 py-4 focus-visible:outline-offset-0 ${trackClassName}`}
        >
          {children}
        </div>

        <RailButton direction={-1} hidden={edges.atStart} onClick={() => scrollBy(-1)} />
        <RailButton direction={1} hidden={edges.atEnd} onClick={() => scrollBy(1)} />
      </div>

      {counter && total > 1 ? (
        <div className="mt-4 flex items-center gap-3 font-hud text-ink" aria-hidden="true">
          <span className="text-2xl font-bold leading-none">{pad(index + 1)}</span>
          <span className="text-sm font-semibold text-steel">/ {pad(total)}</span>
        </div>
      ) : null}
    </div>
  );
}

function RailButton({
  direction,
  hidden,
  onClick,
}: {
  direction: 1 | -1;
  hidden: boolean;
  onClick: () => void;
}) {
  const Icon = direction === 1 ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden}
      aria-label={direction === 1 ? "Scroll right" : "Scroll left"}
      className={`absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center text-accent drop-shadow-[0_0_6px_rgb(242_90_29/0.75)] transition-[opacity,filter,scale] duration-200 ease-snap hover:scale-125 hover:drop-shadow-[0_0_10px_rgb(242_90_29/0.9)] active:scale-90 ${
        direction === 1 ? "-right-1" : "-left-1"
      } ${hidden ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <Icon aria-hidden="true" className="size-8" strokeWidth={2.6} />
    </button>
  );
}
