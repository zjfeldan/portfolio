import Image from "next/image";
import { proficiencyLabel } from "@/lib/format";
import { getIcon } from "@/lib/icons";
import type { Skill } from "@/lib/types";

const SIZE = 76;
const STROKE = 5;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Skill badge: icon in the middle, ring showing proficiency (1–5).
 * The ring fills when its parent <InView> scrolls into view.
 */
export function SkillRing({ skill, index }: { skill: Skill; index: number }) {
  const Icon = getIcon(skill.iconKey);
  const fraction = Math.min(Math.max(skill.proficiency, 1), 5) / 5;
  const label = proficiencyLabel(skill.proficiency);

  return (
    <div className="group flex w-[92px] shrink-0 snap-start flex-col items-center gap-2 text-center">
      <div
        className="relative transition-transform duration-500 ease-juice group-hover:-translate-y-1 group-hover:scale-105"
        style={{ width: SIZE, height: SIZE }}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0 -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            className="stroke-line/80"
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            className="skill-ring-arc stroke-cyan"
            style={
              {
                "--ring-c": CIRCUMFERENCE,
                "--ring-offset": CIRCUMFERENCE * (1 - fraction),
                "--ring-delay": `${index * 80}ms`,
              } as React.CSSProperties
            }
          />
        </svg>
        <div className="absolute inset-[11px] grid place-items-center rounded-full bg-raised text-ink ring-1 ring-line transition-colors duration-300 group-hover:bg-cyan group-hover:text-night">
          {skill.iconUrl ? (
            // unoptimized: skill icons are small SVGs, which need no resizing
            <Image
              src={skill.iconUrl}
              alt=""
              width={26}
              height={26}
              unoptimized
              className="size-[26px]"
            />
          ) : (
            <Icon aria-hidden="true" className="size-[22px]" strokeWidth={2.2} />
          )}
        </div>
      </div>
      <div className="leading-tight">
        <p className="text-xs font-bold text-ink">{skill.name}</p>
        <p className="mt-0.5 text-[11px] text-mist">
          {label}
          <span className="sr-only"> ({skill.proficiency} of 5)</span>
        </p>
      </div>
    </div>
  );
}
