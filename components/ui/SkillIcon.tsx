import Image from "next/image";
import type { IconType } from "react-icons";
import {
  SiCss,
  SiFacebook,
  SiGithub,
  SiHtml5,
  SiInkscape,
  SiNextdotjs,
  SiPostgresql,
  SiReact,
} from "react-icons/si";
import { getIcon } from "@/lib/icons";

/**
 * Brand logos from the free Simple Icons set (via react-icons).
 * Use them in the database as icon_key 'si:<name>', e.g. 'si:react'.
 */
const BRANDS: Record<string, IconType> = {
  html5: SiHtml5,
  css: SiCss,
  react: SiReact,
  nextjs: SiNextdotjs,
  postgresql: SiPostgresql,
  inkscape: SiInkscape,
  github: SiGithub,
  facebook: SiFacebook,
};

/**
 * Icon for a skill or tool. Checked in this order:
 *   1. icon_url        -> your own SVG/PNG file (e.g. an official logo)
 *   2. 'text:Ps'       -> a letter badge, for brands with no free logo
 *   3. 'si:react'      -> a brand logo from the list above
 *   4. anything else   -> a general icon from lib/icons.ts
 */
export function SkillIcon({
  iconKey,
  iconUrl,
  size,
  className = "",
}: {
  iconKey: string;
  iconUrl: string | null;
  size: number;
  className?: string;
}) {
  if (iconUrl) {
    // unoptimized: logos are small files that need no resizing
    return (
      <Image
        src={iconUrl}
        alt=""
        width={size}
        height={size}
        unoptimized
        className={`object-contain ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (iconKey.startsWith("text:")) {
    const letters = iconKey.slice(5);
    return (
      <span
        aria-hidden="true"
        className={`font-hud font-bold leading-none tracking-tight ${className}`}
        style={{ fontSize: Math.round(size * (letters.length > 2 ? 0.6 : 0.78)) }}
      >
        {letters}
      </span>
    );
  }

  const Brand = iconKey.startsWith("si:") ? BRANDS[iconKey.slice(3)] : undefined;
  if (Brand) return <Brand aria-hidden="true" size={size} className={className} />;

  const Icon = getIcon(iconKey);
  return <Icon aria-hidden="true" className={className} style={{ width: size, height: size }} strokeWidth={2} />;
}
