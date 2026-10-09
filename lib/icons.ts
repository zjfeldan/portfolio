import {
  Award,
  Briefcase,
  Circle,
  Cloud,
  Code,
  Database,
  Film,
  GitBranch,
  Globe,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  Mail,
  MapPin,
  Palette,
  PenTool,
  Server,
  Sparkles,
  UserRound,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/**
 * Placeholder icons, looked up by the `icon_key` text stored in PostgreSQL.
 * To use your own SVG for a skill, set its `icon_url` instead; it takes
 * priority over the key.
 */
const registry = {
  user: UserRound,
  grid: LayoutGrid,
  sparkles: Sparkles,
  award: Award,
  mail: Mail,
  database: Database,
  code: Code,
  server: Server,
  layers: Layers,
  cloud: Cloud,
  workflow: Workflow,
  palette: Palette,
  pen: PenTool,
  image: ImageIcon,
  film: Film,
  briefcase: Briefcase,
  graduation: GraduationCap,
  globe: Globe,
  map: MapPin,
  github: GitBranch,
  linkedin: Briefcase,
  behance: Palette,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof registry;

export function getIcon(key: string | null | undefined): LucideIcon {
  return key && key in registry ? registry[key as IconKey] : Circle;
}
