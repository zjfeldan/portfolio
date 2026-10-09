import { ArrowDownRight, ChevronRight } from "lucide-react";
import { AssetHint, AssetSlot } from "@/components/ui/AssetSlot";
import { Panel } from "@/components/ui/Panel";
import { site } from "@/lib/site";
import type { Profile } from "@/lib/types";

/**
 * Hero / About card. The portrait sits in its own column and rises above the
 * card's top edge, over large outlined initials, like a character select.
 */
export function AboutSection({ profile }: { profile: Profile }) {
  return (
    <Panel id="about" labelledBy="about-title" className="pt-24 sm:pt-28 lg:pt-14">
      <div className="relative grid rounded-[28px] bg-linear-to-br from-panel via-panel to-raised ring-1 ring-line/70 lg:min-h-[400px] lg:grid-cols-[1.1fr_1fr]">
        {/* Backdrop: stripes and outlined initials, clipped to the card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]"
        >
          <div className="absolute inset-y-0 right-0 w-full bg-[repeating-linear-gradient(135deg,rgb(91_224_255/0.07)_0_14px,transparent_14px_30px)] [mask-image:linear-gradient(to_left,black,transparent)] lg:w-3/5" />
          <span className="absolute -right-4 top-1/2 -translate-y-1/2 select-none font-display text-[clamp(9rem,26vw,19rem)] font-extrabold leading-none tracking-tighter text-cyan/35 text-outline max-lg:top-24">
            {site.initials}
          </span>
        </div>

        {/* Portrait column */}
        <div className="relative order-1 h-[240px] sm:h-[280px] lg:order-2 lg:h-auto">
          <div className="animate-pop absolute inset-x-0 -top-20 bottom-0 mx-auto w-[min(78%,340px)] [animation-delay:150ms] sm:-top-24 lg:-top-16 lg:right-8 lg:mr-0 lg:w-[min(90%,400px)]">
            <AssetSlot
              src={profile.portraitUrl}
              alt={`Portrait of ${profile.fullName}`}
              sizes="(min-width: 1024px) 400px, 80vw"
              eager
              className="h-full w-full"
              imageClassName="object-contain object-bottom drop-shadow-[0_24px_40px_rgb(0_0_0/0.45)]"
            >
              <PortraitPlaceholder />
            </AssetSlot>
          </div>
        </div>

        {/* Text column */}
        <div className="relative order-2 flex flex-col justify-center gap-5 p-6 sm:p-8 lg:order-1 lg:p-12">
          <span className="animate-rise inline-flex w-fit rounded-full bg-cyan px-3 py-1 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-night">
            About
          </span>

          <div className="animate-rise [animation-delay:80ms]">
            <h1
              id="about-title"
              className="font-display text-[clamp(2.4rem,7vw,4.25rem)] font-extrabold uppercase leading-[0.92] tracking-tight text-ink"
            >
              {profile.displayName}
            </h1>
            <p className="mt-3 text-base font-semibold text-cyan sm:text-lg">{profile.headline}</p>
          </div>

          <p className="animate-rise max-w-[52ch] text-[15px] leading-relaxed text-mist [animation-delay:160ms]">
            {profile.bio}
          </p>

          <div className="animate-rise flex flex-wrap items-center gap-3 [animation-delay:240ms]">
            <a
              href="#portfolio"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-night shadow-[0_10px_26px_-10px_rgb(238_240_255/0.6)] transition-transform duration-500 ease-juice hover:-translate-y-0.5 hover:scale-[1.03] active:scale-95"
            >
              See my projects
              <ArrowDownRight
                aria-hidden="true"
                className="size-4 transition-transform duration-500 ease-juice group-hover:rotate-45"
                strokeWidth={2.6}
              />
            </a>
            <a
              href="#credentials"
              className="group inline-flex items-center gap-1 rounded-full px-3 py-2.5 text-sm font-semibold text-lilac transition-colors hover:text-ink"
            >
              See more
              <ChevronRight
                aria-hidden="true"
                className="size-4 transition-transform duration-500 ease-juice group-hover:translate-x-1"
                strokeWidth={2.6}
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
      <div className="absolute bottom-0 left-1/2 h-[58%] w-[74%] -translate-x-1/2 rounded-t-[44%] rounded-b-[22px] bg-night/95 ring-1 ring-cyan/25" />
      {/* head */}
      <div className="absolute left-1/2 top-[4%] aspect-square w-[40%] -translate-x-1/2 rounded-full bg-night/95 ring-1 ring-cyan/25" />
      <AssetHint>/images/profile/portrait.png</AssetHint>
    </div>
  );
}
