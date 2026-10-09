/**
 * Site-wide settings that rarely change.
 * Content that changes (projects, skills, experience...) lives in PostgreSQL.
 */
export const site = {
  name: "Zach Jacob T. Feldan",
  shortName: "Zach Jacob",
  initials: "ZJ",
  title: "Zach Jacob T. Feldan | Portfolio",
  description:
    "Multimedia professional moving into IT, focused on databases and web development.",
  /** Square avatar for the sidebar, e.g. "/images/profile/avatar.webp". null = initials */
  avatarSrc: null as string | null,
  /** Background art for the contact panel, e.g. "/images/contact/scene.webp" */
  contactSceneSrc: null as string | null,
  copyrightYear: 2026,
};

/**
 * Page sections, in scroll order. The header, sidebar and scroll spy all read
 * from this list, so adding a section here adds it everywhere.
 * `icon` is a key from lib/icons.ts.
 */
export const sections = [
  { id: "about", label: "About", icon: "user" },
  { id: "portfolio", label: "Portfolio", icon: "grid" },
  { id: "skills", label: "Skills", icon: "sparkles" },
  { id: "credentials", label: "Credentials", icon: "award" },
  { id: "contact", label: "Contact", icon: "mail" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const sectionIds: readonly SectionId[] = sections.map((s) => s.id);
