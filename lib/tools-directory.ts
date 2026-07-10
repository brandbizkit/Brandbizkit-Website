import fs from "fs";
import path from "path";
import { currentYear } from "./year";

export type DirectoryTool = {
  name: string;
  url: string;
  why: string;
  pricing: "free" | "free-credits" | "freemium";
  freeDetails: string;
  lastVerified: string;
};

export type ToolCategory = {
  id: string;
  title: string;
  blurb: string;
  tools: DirectoryTool[];
};

export type ToolsDirectory = {
  updatedAt: string;
  updateNote: string;
  pricingLabels: Record<string, string>;
  categories: ToolCategory[];
};

const FILE = path.join(process.cwd(), "content", "tools-directory.json");

export function getToolsDirectory(): ToolsDirectory {
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

/**
 * Which directory categories power which listicle page, keyed by the page's
 * BASE id (year-less). Four of these pages carry a year in their URL and
 * headline that rolls forward automatically every January 1st — see
 * `matchToolsPageSlug` below, which resolves any requested URL slug
 * (current year, a past year, or the bare base) back to one of these ids.
 */
export const PAGE_CATEGORIES: Record<string, string[] | "all"> = {
  "top-free-ai-tools": "all",
  "top-free-ai-image-tools": ["top-ai-image-tools", "top-ai-design-tools"],
  "top-free-ai-video-tools": ["top-ai-video-tools", "top-ai-voice-transcription-tools"],
  "top-free-ai-no-code-tools": ["top-ai-website-app-building-tools", "top-ai-agents-automation-tools"],
};

/** Base ids whose public URL and headline carry the current year. */
const YEARED_BASES = [
  "top-free-ai-tools",
  "top-free-ai-image-tools",
  "top-free-ai-video-tools",
  "top-free-ai-no-code-tools",
];

export type ToolsPageMatch = {
  base: string;
  hasYear: boolean;
  canonicalSlug: string;
  requestedYear?: number;
};

/** The current, correct public slug for a tools-directory page's base id. */
export function canonicalToolsSlug(base: string): string {
  return YEARED_BASES.includes(base) ? `${base}-${currentYear()}` : base;
}

/**
 * Resolve an incoming URL slug (e.g. "top-free-ai-tools-2025", "-2026", or
 * the bare "free-ai-tools") to its base id and canonical (current-year) slug.
 * Returns null if the slug doesn't match any tools-directory page at all.
 */
export function matchToolsPageSlug(slug: string): ToolsPageMatch | null {
  if (slug in PAGE_CATEGORIES && !YEARED_BASES.includes(slug)) {
    // bare, year-less page (currently only "free-ai-tools")
    return { base: slug, hasYear: false, canonicalSlug: slug };
  }
  for (const base of YEARED_BASES) {
    const m = slug.match(new RegExp(`^${base}-(\\d{4})$`));
    if (m) {
      return {
        base,
        hasYear: true,
        canonicalSlug: canonicalToolsSlug(base),
        requestedYear: Number(m[1]),
      };
    }
  }
  return null;
}

/** Every tools-directory page's current canonical (current-year) public slug. */
export function getCanonicalToolsSlugs(): string[] {
  return Object.keys(PAGE_CATEGORIES).map((base) => canonicalToolsSlug(base));
}

export function getCategoriesForPage(base: string): ToolCategory[] | null {
  const spec = PAGE_CATEGORIES[base];
  if (!spec) return null;
  const dir = getToolsDirectory();
  if (spec === "all") return dir.categories;
  return dir.categories.filter((c) => spec.includes(c.id));
}

export function directoryToMd(slug: string): string | null {
  const cats = getCategoriesForPage(slug);
  if (!cats) return null;
  const dir = getToolsDirectory();
  const lines: string[] = [
    `_Last updated: ${dir.updatedAt} — refreshed weekly with the most popular free and free-credit AI tools._`,
    "",
  ];
  for (const c of cats) {
    lines.push(`## ${c.title}`, "", c.blurb, "");
    for (const t of c.tools) {
      lines.push(
        `- **[${t.name}](${t.url})** (${dir.pricingLabels[t.pricing] ?? t.pricing} — ${t.freeDetails}): ${t.why}`
      );
    }
    lines.push("");
  }
  return lines.join("\n");
}
