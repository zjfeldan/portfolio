"use client";

import { useEffect, useRef } from "react";

/**
 * Marks itself with data-inview="true" the first time it scrolls into view.
 * CSS can then start an animation (see .skill-ring-arc in globals.css)
 * without re-rendering anything.
 */
export function InView({
  className = "",
  threshold = 0.3,
  children,
}: {
  className?: string;
  threshold?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.inview = "true";
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
