import type { PortfolioData } from "./types";

/**
 * Sample content used only when PostgreSQL can't be reached, so the layout
 * still renders while you set things up. It mirrors db/seed.sql.
 * Your real content lives in the database, not here.
 */
export const fallbackData: PortfolioData = {
  profile: {
    fullName: "Zach Jacob T. Feldan",
    displayName: "Zach Jacob",
    headline: "Multimedia | IT",
    bio: "I handle multimedia for the Communications Bureau of UST General Santos and I'm a first-year MSIT student at Ateneo de Davao. I design, illustrate and animate, and I'm learning to build web-based apps.",
    portraitUrl: null,
    location: "General Santos City, Philippines",
    email: "zachjacobtfeldan@gmail.com",
    resumeUrl: "/files/Zach-Jacob-Feldan-CV.pdf",
  },
  categories: [
    {
      id: 1,
      slug: "digital-art-graphic-design",
      name: "Digital Art and Graphic Design",
      iconKey: "palette",
      coverUrl: null,
      projects: [],
    },
    {
      id: 2,
      slug: "web-development",
      name: "Web Development",
      iconKey: "code",
      coverUrl: null,
      projects: [
        {
          id: 1,
          slug: "portfolio-website",
          title: "This Portfolio",
          description:
            "My personal portfolio, designed and built from scratch. The front end uses Next.js and Tailwind CSS, and every project, skill and credential is stored in a PostgreSQL database and loaded in a single query. It includes a category stack, a Pinterest-style gallery with sorting, an image viewer that adapts to portrait and landscape work, and a script that converts and imports artwork automatically.",
          imageUrl: "/images/projects/web-development/portfolio-website.png",
          imageAlt: "Home page of my portfolio website",
          imageWidth: null,
          imageHeight: null,
          projectUrl: "https://github.com/zjfeldan",
          completedOn: "2026-10-09",
          tools: [
            { name: "HTML", iconKey: "si:html5", iconUrl: null },
            { name: "CSS", iconKey: "si:css", iconUrl: null },
            { name: "React", iconKey: "si:react", iconUrl: null },
            { name: "Next.js", iconKey: "si:nextjs", iconUrl: null },
            { name: "Tailwind CSS", iconKey: "code", iconUrl: null },
            { name: "PostgreSQL", iconKey: "si:postgresql", iconUrl: null },
          ],
        },
      ],
    },
    {
      id: 3,
      slug: "motion-graphics",
      name: "Motion Graphics",
      iconKey: "film",
      coverUrl: null,
      projects: [],
    },
  ],
  skills: [
    { id: 1, slug: "html", name: "HTML", category: "web", proficiency: 3, iconKey: "si:html5", iconUrl: null },
    { id: 2, slug: "css", name: "CSS", category: "web", proficiency: 3, iconKey: "si:css", iconUrl: null },
    { id: 3, slug: "react", name: "React", category: "web", proficiency: 1, iconKey: "si:react", iconUrl: null },
    { id: 4, slug: "nextjs", name: "Next.js", category: "web", proficiency: 1, iconKey: "si:nextjs", iconUrl: null },
    { id: 5, slug: "photoshop", name: "Photoshop", category: "design", proficiency: 5, iconKey: "text:Ps", iconUrl: null },
    { id: 6, slug: "clip-studio", name: "Clip Studio", category: "design", proficiency: 5, iconKey: "text:CSP", iconUrl: null },
    { id: 7, slug: "procreate", name: "Procreate", category: "design", proficiency: 5, iconKey: "text:Pc", iconUrl: null },
    { id: 8, slug: "illustrator", name: "Illustrator", category: "design", proficiency: 5, iconKey: "text:Ai", iconUrl: null },
    { id: 9, slug: "inkscape", name: "Inkscape", category: "design", proficiency: 5, iconKey: "si:inkscape", iconUrl: null },
    { id: 10, slug: "indesign", name: "InDesign", category: "design", proficiency: 3, iconKey: "text:Id", iconUrl: null },
    { id: 11, slug: "after-effects", name: "After Effects", category: "motion", proficiency: 1, iconKey: "text:Ae", iconUrl: null },
    { id: 12, slug: "postgresql", name: "PostgreSQL", category: "database", proficiency: 3, iconKey: "si:postgresql", iconUrl: null },
  ],
  certificates: [],
  experiences: [
    {
      id: 1,
      role: "Support Staff, Multimedia",
      organization: "Communications Bureau, UST General Santos",
      location: "General Santos City",
      startDate: "2025-01-01",
      endDate: null,
      summary: null,
      highlights: [
        "Lead multimedia output for the institution",
        "Assist in public relations initiatives",
        "Coordinate coverage and documentation with the Bureau director",
        "Train student volunteers in design and media",
      ],
    },
    {
      id: 2,
      role: "Visual Lead",
      organization: "MegaCat Studios",
      location: "Pittsburgh, Pennsylvania (remote)",
      startDate: "2024-01-01",
      endDate: "2025-12-31",
      summary: null,
      highlights: ["Led the visual direction of a game development project across 2D, 3D, UI and special effects"],
    },
  ],
  education: [
    {
      id: 1,
      degree: "Master of Science in Information Technology",
      school: "Ateneo de Davao University",
      startYear: 2026,
      endYear: null,
      status: "in_progress",
      details: null,
    },
    {
      id: 2,
      degree: "Bachelor of Science in Information Technology",
      school: "MSU General Santos",
      startYear: null,
      endYear: 2024,
      status: "completed",
      details: "Major in Database · Cum Laude · DOST Scholar",
    },
  ],
  socials: [
    { id: 1, platform: "github", label: "GitHub", url: "https://github.com/zjfeldan", iconKey: "si:github" },
    { id: 2, platform: "facebook", label: "Facebook", url: "https://www.facebook.com/zachjacob.feldan", iconKey: "si:facebook" },
  ],
};
