"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Horizontal, swipeable row that snaps to each item. Arrow buttons appear
 * only when there is more to scroll in that direction.
 */
export function Rail({
  label,
  className = "",
  trackClassName = "",
  children,
}: {
  /** Read by screen readers, e.g. "Projects" */
  label: string;
  className?: string;
  trackClassName?: string;
  children: React.ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: true });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      const next = { atStart: track.scrollLeft <= 2, atEnd: track.scrollLeft >= max };
      setEdges((prev) =>
        prev.atStart === next.atStart && prev.atEnd === next.atEnd ? prev : next,
      );
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

  return (
    <div className={`relative ${className}`}>
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={`no-scrollbar relative -mx-1 -my-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-1 px-1 py-4 focus-visible:outline-offset-0 ${trackClassName}`}
      >
        {children}
      </div>

      <RailButton direction={-1} hidden={edges.atStart} onClick={() => scrollBy(-1)} />
      <RailButton direction={1} hidden={edges.atEnd} onClick={() => scrollBy(1)} />
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
      className={`absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ink text-night shadow-[0_10px_24px_-8px_rgb(0_0_0/0.7)] ring-4 ring-frame transition-[opacity,transform] duration-500 ease-juice hover:scale-110 active:scale-90 ${
        direction === 1 ? "-right-2 sm:-right-3" : "-left-2 sm:-left-3"
      } ${hidden ? "pointer-events-none scale-75 opacity-0" : "opacity-100"}`}
    >
      <Icon aria-hidden="true" className="size-5" strokeWidth={2.6} />
    </button>
  );
}
