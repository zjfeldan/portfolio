"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type Slide = { src: string; alt: string };

/**
 * Cross-fading image rotation for the About card.
 * - Changes every `interval` ms (2.5 s by default)
 * - Click / tap (or Enter) jumps to the next image and restarts the timer
 * - Pauses while a mouse hovers it and while the browser tab is hidden
 * - Doesn't auto-rotate for visitors who turn on "reduce motion" (clicking still works)
 */
export function PortraitSlideshow({
  slides,
  sizes,
  interval = 2500,
  fit = "contain",
}: {
  slides: readonly Slide[];
  sizes: string;
  interval?: number;
  /** "contain" for transparent cut-outs (keeps the pop-out look), "cover" for regular photos */
  fit?: "contain" | "cover";
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const count = slides.length;

  const next = () => setIndex((current) => (current + 1) % count);

  // Stop while the browser tab is in the background
  useEffect(() => {
    const onChange = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  // One timer per slide: any change of slide (automatic or clicked) restarts the countdown
  useEffect(() => {
    if (count < 2 || paused || tabHidden) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % count);
    }, interval);
    return () => window.clearTimeout(timer);
  }, [index, count, interval, paused, tabHidden]);

  const fitClass =
    fit === "cover"
      ? "object-cover"
      : "object-contain object-bottom drop-shadow-[0_24px_30px_rgb(0_0_0/0.25)]";

  return (
    <button
      type="button"
      onClick={next}
      disabled={count < 2}
      aria-label={`Show next picture (${index + 1} of ${count})`}
      // Only a real mouse pauses it; a tap on a phone shouldn't freeze the rotation
      onPointerEnter={(event) => event.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      className="group relative block h-full w-full cursor-pointer outline-offset-4 disabled:cursor-default"
    >
      {slides.map((slide, i) => {
        const active = i === index;
        return (
          <Image
            key={slide.src}
            src={slide.src}
            alt={active ? slide.alt : ""}
            aria-hidden={!active}
            fill
            sizes={sizes}
            draggable={false}
            // First slide loads right away; the rest follow in the background
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "low"}
            className={`${fitClass} select-none transition-[opacity,translate] duration-700 ease-snap ${
              active ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
            }`}
          />
        );
      })}
    </button>
  );
}
