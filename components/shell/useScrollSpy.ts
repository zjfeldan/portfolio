"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section the visitor is reading: the last section
 * whose top edge has scrolled past a line 35% down the screen. Works for
 * short sections too (Skills sits inside Portfolio). At the very bottom of
 * the page, the last section wins.
 */
export function useScrollSpy<T extends string>(ids: readonly T[]): T {
  const [active, setActive] = useState<T>(ids[0]);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const line = Math.min(window.innerHeight * 0.35, 320);
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

      let current = ids[0];
      if (atBottom) {
        current = ids[ids.length - 1];
      } else {
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= line) current = id;
        }
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    // Measure at most once per frame while scrolling
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return active;
}
