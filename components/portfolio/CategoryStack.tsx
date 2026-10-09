"use client";

import { useState } from "react";
import { AssetSlot } from "@/components/ui/AssetSlot";
import { InView } from "@/components/ui/InView";
import { getIcon } from "@/lib/icons";
import type { ProjectCategory } from "@/lib/types";
import { defaultOrder } from "./ordering";
import { PortfolioModal } from "./PortfolioModal";

/** Placeholder card colours, cycled so empty cards don't all look the same */
const PLACEHOLDER_TONES = ["bg-shade", "bg-graphite", "bg-[#33332f]"];

/**
 * The image a category card shows: the first entry in the order its gallery
 * opens in (A–Z for art galleries, newest first for the rest), else the
 * category's cover_url.
 */
function cardImage(category: ProjectCategory): string | null {
  const first = category.projects
    .filter((project) => project.imageUrl)
    .sort(defaultOrder(category))[0];
  return first?.imageUrl ?? category.coverUrl;
}

/**
 * One card per category, overlapping in a slight fan. Hovering a card lifts
 * it and shows its label; clicking opens that category's gallery.
 * The fan works out its angles and overlap from the number of categories,
 * so adding a category in the database needs no layout changes.
 */
export function CategoryStack({ categories }: { categories: ProjectCategory[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const count = categories.length;
  const middle = (count - 1) / 2;
  const spread = Math.max(middle, 1);

  return (
    <>
      <InView className="deal-in @container" threshold={0.25}>
        <ul
          aria-label="Portfolio categories"
          className="project-stack flex items-center justify-center px-2 pb-14 pt-20"
          style={{ "--n": count } as React.CSSProperties}
        >
          {categories.map((category, i) => {
            // -1 (far left) ... 0 (centre) ... 1 (far right)
            const t = (i - middle) / spread;
            const rotate = t * 7 + (i % 2 === 0 ? -1.2 : 1.2);
            const drop = t * t * 22;
            const PlaceholderIcon = getIcon(category.iconKey);
            const entries = category.projects.length;

            return (
              <li
                key={category.id}
                className="stack-card group"
                style={
                  {
                    "--i": i,
                    "--c": i - middle,
                    "--r": `${rotate.toFixed(2)}deg`,
                    "--y": `${drop.toFixed(1)}px`,
                  } as React.CSSProperties
                }
              >
                {/* Hover label with a small pointer, like a name tag above the card */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 w-max max-w-[11rem] -translate-x-1/2 translate-y-2 bg-accent px-3 py-1.5 text-center leading-tight sm:max-w-none sm:whitespace-nowrap font-hud text-xs font-bold uppercase tracking-wider text-ink opacity-0 shadow-[0_8px_20px_-8px_rgb(242_90_29/0.8)] transition-[opacity,translate] duration-200 ease-snap group-hover:translate-y-0 group-hover:opacity-100 group-has-[:focus-visible]:translate-y-0 group-has-[:focus-visible]:opacity-100 sm:text-[13px]"
                >
                  {category.name}
                  <span className="absolute left-1/2 top-full -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-accent" />
                </span>

                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  aria-haspopup="dialog"
                  aria-label={`${category.name}, ${entries} ${entries === 1 ? "entry" : "entries"}. Open gallery`}
                  className="block h-full w-full overflow-hidden focus-visible:outline-none"
                >
                  {/* Any image size fills the card: scaled up and centred, edges trimmed */}
                  <AssetSlot
                    src={cardImage(category)}
                    alt=""
                    // a little larger than the card, so the hover zoom stays sharp
                    sizes="(min-width: 1024px) 340px, 50vw"
                    quality={90}
                    className="h-full w-full"
                    imageClassName="object-cover object-center"
                  >
                    {/* Icon sits in the left half, which stays visible when cards overlap */}
                    <div
                      className={`h-full w-full ${
                        PLACEHOLDER_TONES[i % PLACEHOLDER_TONES.length]
                      } bg-[repeating-linear-gradient(135deg,rgb(255_255_255/0.04)_0_1px,transparent_1px_10px)]`}
                    >
                      <div className="grid h-full w-1/2 place-items-center">
                        <PlaceholderIcon aria-hidden="true" className="size-9 text-white/25" strokeWidth={1.6} />
                      </div>
                    </div>
                  </AssetSlot>
                </button>
              </li>
            );
          })}
        </ul>
      </InView>

      <p className="text-center font-hud text-xs font-semibold uppercase tracking-[0.16em] text-steel">
        Select a category to explore
      </p>

      <PortfolioModal
        category={openIndex !== null ? categories[openIndex] : null}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}
