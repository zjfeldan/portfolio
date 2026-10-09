import type { Project, ProjectCategory } from "@/lib/types";

/**
 * Categories shown as a pure art gallery: masonry layout, A–Z sorting,
 * title-only hover, and clicking opens just the full image with its title
 * (no description, tools or link). Add or remove category slugs here.
 */
export const IMAGE_ONLY_CATEGORIES = ["digital-art-graphic-design", "graphic-design", "digital-illustration"];

export function isImageOnly(category: Pick<ProjectCategory, "slug">): boolean {
  return IMAGE_ONLY_CATEGORIES.includes(category.slug);
}

/** A, A1, A2 ... A10, B (numbers compare as numbers, case ignored) */
export function byTitle(a: Project, b: Project): number {
  return (
    a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: "base" }) ||
    a.slug.localeCompare(b.slug, undefined, { numeric: true })
  );
}

/** Newest date first; same date: most recently added first */
export function byNewest(a: Project, b: Project): number {
  return b.completedOn.localeCompare(a.completedOn) || b.id - a.id;
}

/** The order a category opens in: A–Z for art galleries, newest first for the rest */
export function defaultOrder(category: ProjectCategory): (a: Project, b: Project) => number {
  return isImageOnly(category) ? byTitle : byNewest;
}
