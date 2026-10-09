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
    "Multimedia and IT portfolio: design, illustration, animation and web-based apps.",
  /** Square avatar for the sidebar, e.g. "/images/profile/avatar.webp". null = initials */
  avatarSrc: null as string | null,
  /** Background art for the contact panel, e.g. "/images/contact/scene.webp" */
  contactSceneSrc: null as string | null,
  /** About card slideshow. Files go in public/images/about/. Empty list = single portrait. */
  aboutSlides: [
    {
      src: "/images/about/slide-1.webp",
      alt: "chacaracter-1",
    },
    {
      src: "/images/about/slide-2.webp",
      alt: "character-2",
    },
    {
      src: "/images/about/slide-3.webp",
      alt: "character-3",
    },
  ] as { src: string; alt: string }[],
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
