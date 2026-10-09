/**
 * Shapes of the data returned by the portfolio_payload() function in
 * db/schema.sql. Keep the two in sync when you add a column.
 */

export type ProjectCategory = "it" | "creative";

export type SkillCategory =
  | "database"
  | "web"
  | "cloud"
  | "design"
  | "motion"
  | "tool";

export type Profile = {
  fullName: string;
  displayName: string;
  headline: string;
  bio: string;
  portraitUrl: string | null;
  location: string | null;
  email: string | null;
  resumeUrl: string | null;
};

export type Project = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  category: ProjectCategory;
  coverUrl: string | null;
  coverAlt: string | null;
  projectUrl: string | null;
  repoUrl: string | null;
  isFeatured: boolean;
  skills: string[];
};

export type Skill = {
  id: number;
  slug: string;
  name: string;
  category: SkillCategory;
  /** 1 = Beginner ... 5 = Expert */
  proficiency: number;
  iconKey: string;
  iconUrl: string | null;
};

export type Certificate = {
  id: number;
  title: string;
  issuer: string;
  /** "YYYY-MM-DD" */
  issuedOn: string | null;
  credentialUrl: string | null;
  imageUrl: string | null;
};

export type Experience = {
  id: number;
  role: string;
  organization: string;
  location: string | null;
  /** "YYYY-MM-DD" */
  startDate: string;
  /** "YYYY-MM-DD", or null when current */
  endDate: string | null;
  summary: string | null;
  highlights: string[];
};

export type Education = {
  id: number;
  degree: string;
  school: string;
  startYear: number | null;
  endYear: number | null;
  status: "in_progress" | "completed";
  details: string | null;
};

export type SocialLink = {
  id: number;
  platform: string;
  label: string;
  url: string;
  iconKey: string;
};

export type PortfolioData = {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  certificates: Certificate[];
  experiences: Experience[];
  education: Education[];
  socials: SocialLink[];
};
