import { proficiencyLabel } from "@/lib/format";
import type { Skill } from "@/lib/types";
import { SkillIcon } from "./SkillIcon";

const SIZE = 76;
const STROKE = 4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Skill badge: icon in the middle, ring showing proficiency (1–5).
 * The ring fills when its parent <InView> scrolls into view.
 */
export function SkillRing({ skill, index }: { skill: Skill; index: number }) {
  const level = Math.min(Math.max(skill.proficiency, 1), 5);
  const label = proficiencyLabel(level);

  return (
    <div className="group flex w-[92px] shrink-0 snap-start flex-col items-center gap-2 text-center">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            className="stroke-line"
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="butt"
            className="skill-ring-arc stroke-accent"
            style={
              {
                "--ring-c": CIRCUMFERENCE,
                "--ring-offset": CIRCUMFERENCE * (1 - level / 5),
                "--ring-delay": `${index * 70}ms`,
              } as React.CSSProperties
            }
          />
        </svg>
        <div className="absolute inset-[10px] grid place-items-center rounded-full bg-ink text-white transition-[background-color,box-shadow] duration-200 ease-snap group-hover:bg-accent group-hover:text-ink group-hover:shadow-[0_0_26px_-2px_rgb(242_90_29/0.7)]">
          <SkillIcon iconKey={skill.iconKey} iconUrl={skill.iconUrl} size={24} />
        </div>
      </div>
      <div className="leading-tight">
        <p className="text-xs font-bold text-ink">{skill.name}</p>
        {/* Five ticks: a second, flat readout of the level */}
        <p className="mt-1 flex justify-center gap-0.5" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`h-1 w-2.5 ${i < level ? "bg-accent" : "bg-line"}`} />
          ))}
        </p>
        <p className="mt-1 font-hud text-[11px] font-semibold uppercase tracking-wider text-steel">
          {label}
          <span className="sr-only"> ({level} of 5)</span>
        </p>
      </div>
    </div>
  );
}
