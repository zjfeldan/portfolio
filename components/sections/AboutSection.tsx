import { ChevronRight, Play } from "lucide-react";
import { AssetSlot } from "@/components/ui/AssetSlot";
import { Panel } from "@/components/ui/Panel";
import { PortraitSlideshow } from "@/components/ui/PortraitSlideshow";
import { site } from "@/lib/site";
import type { Profile } from "@/lib/types";

/**
 * Hero / About card. The portrait sits in its own column and rises above the
 * card's top edge, over outlined initials.
 */
export function AboutSection({ profile }: { profile: Profile }) {
  const nameLines = profile.displayName.split(/\s+/);

  return (
    <Panel
      id="about"
      labelledBy="about-title"
      className="pt-24 sm:pt-28 lg:pt-14"
    >
      <div className="relative grid border border-line bg-surface lg:min-h-[500px] lg:grid-cols-[1.1fr_1fr]">
        {/* Backdrop: hatch and outlined initials, clipped to the card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute inset-y-0 right-0 w-full bg-[repeating-linear-gradient(135deg,rgb(14_14_14/0.045)_0_1px,transparent_1px_12px)] lg:w-3/5" />
          <span className="absolute -right-3 bottom-[-0.12em] select-none font-display text-[clamp(8rem,24vw,18rem)] font-black leading-none tracking-tighter text-line text-outline">
            {site.initials}
          </span>
        </div>

        {/* Portrait column */}
        <div className="relative order-1 h-[320px] sm:h-[400px] lg:order-2 lg:h-auto">
          <div className="animate-slide-in absolute inset-x-0 -top-24 bottom-0 mx-auto w-[min(92%,420px)] [animation-delay:120ms] sm:-top-28 lg:-top-24 lg:right-4 lg:mr-0 lg:w-[min(100%,520px)]">
            {site.aboutSlides.length > 0 ? (
              <PortraitSlideshow
                slides={site.aboutSlides}
                sizes="(min-width: 1024px) 400px, 80vw"
              />
            ) : (
              <AssetSlot
                src={profile.portraitUrl}
                alt={`Portrait of ${profile.fullName}`}
                sizes="(min-width: 1024px) 400px, 80vw"
                eager
                className="h-full w-full"
                imageClassName="object-contain object-bottom drop-shadow-[0_24px_30px_rgb(0_0_0/0.25)]"
              >
                <PortraitPlaceholder />
              </AssetSlot>
            )}
          </div>
        </div>

        {/* Text column */}
        <div className="relative order-2 flex flex-col justify-center gap-5 p-6 sm:p-8 lg:order-1 lg:p-12">
          <span className="animate-rise w-fit bg-accent px-3 py-1 font-hud text-xs font-bold uppercase tracking-[0.18em] text-ink">
            About
          </span>

          <div>
            <h1
              id="about-title"
              className="animate-wipe font-display text-[clamp(2.6rem,7vw,4.5rem)] font-black uppercase leading-[0.9] tracking-tight text-ink [animation-delay:80ms]"
            >
              {nameLines.map((word, i) => (
                <span key={`${word}-${i}`} className="block">
                  {word}
                </span>
              ))}
            </h1>
            <p className="animate-rise mt-4 font-hud text-sm font-bold uppercase tracking-[0.14em] text-accent-ink [animation-delay:200ms]">
              {profile.headline}
            </p>
          </div>

          <p className="animate-rise max-w-[52ch] text-[15px] leading-relaxed text-steel [animation-delay:260ms]">
            {profile.bio}
          </p>

          <div className="animate-rise flex flex-wrap items-center gap-3 [animation-delay:320ms]">
            <a
              href="#portfolio"
              className="flex items-center gap-2 border-2 border-ink bg-ink px-5 py-2.5 font-hud text-sm font-bold uppercase tracking-wider text-white transition-[background-color,border-color,color,box-shadow] duration-200 ease-snap hover:border-accent hover:bg-accent hover:text-ink hover:shadow-[0_0_24px_-4px_rgb(242_90_29/0.8)] active:animate-bloom"
            >
              <Play
                aria-hidden="true"
                className="size-3.5 fill-current"
                strokeWidth={2}
              />
              See my projects
            </a>
            <a
              href="#credentials"
              className="group flex items-center gap-1 border-2 border-ink px-4 py-2.5 font-hud text-sm font-bold uppercase tracking-wider text-ink transition-colors duration-200 ease-snap hover:bg-ink hover:text-white active:animate-bloom"
            >
              See more
              <ChevronRight
                aria-hidden="true"
                className="size-4 transition-transform duration-200 ease-snap group-hover:translate-x-0.5"
                strokeWidth={2.4}
              />
            </a>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function PortraitPlaceholder() {
  return (
    <div className="relative h-full w-full">
      {/* body */}
      <div className="absolute bottom-0 left-1/2 h-[58%] w-[74%] -translate-x-1/2 bg-shade [clip-path:polygon(18%_0,82%_0,100%_22%,100%_100%,0_100%,0_22%)]" />
      {/* head (a circle) */}
      <div className="absolute left-1/2 top-[4%] aspect-square w-[40%] -translate-x-1/2 rounded-full bg-shade" />
    </div>
  );
}
