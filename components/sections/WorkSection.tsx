import { CategoryStack } from "@/components/portfolio/CategoryStack";
import { InView } from "@/components/ui/InView";
import { Panel, SectionTitle, Tray } from "@/components/ui/Panel";
import { Rail } from "@/components/ui/Rail";
import { SkillRing } from "@/components/ui/SkillRing";
import type { ProjectCategory, Skill } from "@/lib/types";

/** Portfolio category stack + skills row, sharing one panel as in the wireframe */
export function WorkSection({
  categories,
  skills,
}: {
  categories: ProjectCategory[];
  skills: Skill[];
}) {
  return (
    <Panel id="portfolio" labelledBy="portfolio-title">
      <SectionTitle id="portfolio-title">Portfolio</SectionTitle>

      <div className="mt-2">
        <CategoryStack categories={categories} />
      </div>

      {/* data-snap: Skills is its own scroll landing point inside this panel */}
      <div id="skills" data-snap className="mt-10">
        <SectionTitle>Skills</SectionTitle>
        <InView className="mt-5">
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
