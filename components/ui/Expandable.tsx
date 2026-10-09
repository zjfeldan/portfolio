"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

/**
 * Shows `visible` content, with `more` tucked behind a glowing chevron button.
 * The height animates with a CSS grid trick, no measuring needed.
 */
export function Expandable({
  visible,
  more,
  moreLabel = "Show more",
  lessLabel = "Show less",
}: {
  visible: React.ReactNode;
  more?: React.ReactNode;
  moreLabel?: string;
  lessLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div>
      {visible}
      {more ? (
        <>
          <div
            id={id}
            inert={!open}
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-snap ${
              open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">{more}</div>
          </div>
          <div className="mt-2 flex justify-center">
            <button
              type="button"
              aria-expanded={open}
              aria-controls={id}
              aria-label={open ? lessLabel : moreLabel}
              onClick={() => setOpen((value) => !value)}
              className="grid size-10 place-items-center text-accent drop-shadow-[0_0_6px_rgb(242_90_29/0.75)] transition-[filter,scale] duration-200 ease-snap hover:scale-125 hover:drop-shadow-[0_0_10px_rgb(242_90_29/0.9)] active:scale-90"
            >
              <ChevronDown
                aria-hidden="true"
                className={`size-7 transition-transform duration-300 ease-snap ${open ? "rotate-180" : ""}`}
                strokeWidth={2.6}
              />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
