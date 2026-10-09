"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

/**
 * Shows `visible` content, with `more` tucked behind a round chevron button.
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
            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out-soft ${
              open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">{more}</div>
          </div>
          <div className="mt-1 flex justify-center">
            <button
              type="button"
              aria-expanded={open}
              aria-controls={id}
              aria-label={open ? lessLabel : moreLabel}
              onClick={() => setOpen((value) => !value)}
              className="grid size-9 place-items-center rounded-full bg-ink text-night ring-4 ring-frame transition-transform duration-500 ease-juice hover:scale-110 active:scale-90"
            >
              <ChevronDown
                aria-hidden="true"
                className={`size-5 transition-transform duration-500 ease-juice ${open ? "rotate-180" : ""}`}
                strokeWidth={2.6}
              />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
