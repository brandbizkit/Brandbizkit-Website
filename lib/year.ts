/**
 * Single source of truth for "current year" content — the year-suffixed tools
 * pages (and any nav copy referencing them) roll forward automatically every
 * January 1st with no manual edits, by storing a "{YEAR}" token and
 * interpolating it at request time instead of hardcoding a year.
 */
export function currentYear(): number {
  return new Date().getFullYear();
}

export function interpolateYear(text: string): string {
  return text.replace(/\{YEAR\}/g, String(currentYear()));
}
