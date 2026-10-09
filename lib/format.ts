const PROFICIENCY = ["", "Beginner", "Developing", "Intermediate", "Advanced", "Expert"];

export function proficiencyLabel(level: number): string {
  return PROFICIENCY[Math.min(Math.max(Math.round(level), 1), 5)];
}

/** "2025-06-01" -> "2025" */
export function yearOf(date: string | null): string | null {
  return date ? date.slice(0, 4) : null;
}

/** Year range like "2024 – 2025" or "2025 – Present" */
export function yearRange(start: string | number | null, end: string | number | null): string {
  const s = start == null ? null : String(start).slice(0, 4);
  const e = end == null ? "Present" : String(end).slice(0, 4);
  if (!s) return e;
  return s === e ? s : `${s} – ${e}`;
}
