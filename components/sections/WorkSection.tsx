import { ArrowUpRight, Code, Palette } from "lucide-react";
import { AssetHint, AssetSlot } from "@/components/ui/AssetSlot";
import { InView } from "@/components/ui/InView";
import { Panel, SectionTitle, Tray } from "@/components/ui/Panel";
import { Rail } from "@/components/ui/Rail";
import { SkillRing } from "@/components/ui/SkillRing";
import type { Project, Skill } from "@/lib/types";

/** Portfolio carousel + skills row, sharing one panel as in the wireframe */
export function WorkSection({ projects, skills }: { projects: Project[]; skills: Skill[] }) {
  return (
    <Panel id="portfolio" labelledBy="portfolio-title">
      <SectionTitle id="portfolio-title">Portfolio</SectionTitle>

      <Rail label="Projects" className="mt-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Rail>

      {/* data-snap: Skills is its own scroll landing point inside this panel */}
      <div id="skills" data-snap className="mt-8">
        <SectionTitle>Skills</SectionTitle>
        <InView className="mt-4">
          <Tray>
            <Rail label="Skills" trackClassName="gap-3 sm:gap-5">
              {skills.map((skill, index) => (
                <SkillRing key={skill.id} skill={skill} index={index} />
              ))}
            </Rail>
          </Tray>
        </InView>
      </div>
    </Panel>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const href = project.projectUrl ?? project.repoUrl;
  const isIt = project.category === "it";
  const PlaceholderIcon = isIt ? Code : Palette;

  const body = (
    <div className="relative aspect-[5/6] overflow-hidden rounded-[24px] bg-panel ring-1 ring-line/70 transition-[transform,box-shadow] duration-500 ease-juice group-hover:-translate-y-1.5 group-hover:shadow-[0_22px_44px_-14px_rgb(91_224_255/0.45)] group-hover:ring-cyan/60 group-active:scale-[0.98] motion-reduce:transform-none">
      <AssetSlot
        src={project.coverUrl}
        alt={project.coverAlt ?? project.title}
        sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 78vw"
        className="h-full w-full"
        imageClassName="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
      >
        <div
          className={`absolute inset-0 grid place-items-center ${
            isIt
              ? "bg-[radial-gradient(circle_at_30%_20%,rgb(91_224_255/0.28),transparent_60%)]"
              : "bg-[radial-gradient(circle_at_70%_20%,rgb(255_143_177/0.28),transparent_60%)]"
          }`}
        >
          <PlaceholderIcon
            aria-hidden="true"
            className="-mt-16 size-14 text-ink/25 transition-transform duration-700 ease-juice group-hover:-rotate-6 group-hover:scale-110"
            strokeWidth={1.6}
          />
        </div>
        <AssetHint position="top">/images/projects/{project.slug}.webp</AssetHint>
      </AssetSlot>

      {/* Readability gradient behind the text */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-night via-night/80 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 sm:p-5">
        <span
          className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
            isIt ? "bg-cyan text-night" : "bg-blush text-night"
          }`}
        >
          {isIt ? "IT project" : "Creative"}
        </span>
        <h3 className="font-display text-[15px] font-bold leading-snug text-ink sm:text-base">
          {project.title}
        </h3>
        <p className="line-clamp-2 text-[13px] leading-snug text-mist">{project.summary}</p>
        {project.skills.length > 0 ? (
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {project.skills.slice(0, 3).map((name) => (
              <li
                key={name}
                className="rounded-full bg-raised/80 px-2 py-0.5 text-[11px] font-semibold text-ink/90"
              >
                {name}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {href ? (
        <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-ink text-night opacity-0 transition-[opacity,transform] duration-500 ease-juice group-hover:rotate-45 group-hover:opacity-100 group-focus-visible:opacity-100">
          <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={2.6} />
        </span>
      ) : null}
    </div>
  );

  const itemClass =
    "group block shrink-0 snap-start basis-[78%] rounded-[24px] sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]";

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={itemClass}>
      {body}
    </a>
  ) : (
    <article className={itemClass}>{body}</article>
  );
}
