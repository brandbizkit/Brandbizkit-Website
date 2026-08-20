import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { interpolateYear } from "./year";
import { canonicalToolsSlug, PAGE_CATEGORIES as TOOLS_PAGE_CATEGORIES } from "./tools-directory";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");

export type NavItem = {
  label: string;
  href: string;
  cta?: boolean;
  children?: { label: string; href: string }[];
};

export type SiteConfig = {
  name: string;
  legalName: string;
  tagline: string;
  url: string;
  email: string;
  logo: string;
  logoIcon: string;
  description: string;
  founders: { name: string }[];
  keywords: string[];
  social: Record<string, string>;
  nav: NavItem[];
  footerExpect: string[];
};

export type ChartSpec = {
  type: "bar" | "line" | "donut";
  title: string;
  data: { label: string; value: number }[];
  unit?: string;
  source?: string;
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  readTime?: string;
  image?: string;
  imageAlt?: string;
  videos?: string[];
  charts?: ChartSpec[];
  body: string; // markdown
};

export type Tool = {
  slug: string;
  name: string;
  question: string;
  title: string;
  description: string;
  tagline: string;
  paragraphs: string[];
  courseUrl?: string | null;
  courseLabel?: string | null;
  image?: string;
  cardImage?: string;
  images: { src: string; alt: string }[];
  videos?: string[];
  capabilities?: {
    heading: string;
    sub: string;
    items: { title: string; text: string }[];
  };
  howItWorks?: {
    heading: string;
    sub: string;
    steps: { title: string; text: string }[];
  };
  /** ISO date this tool's capabilities were last checked against the live
   *  product — these pages should be re-verified periodically since AI
   *  tools ship new features often. */
  lastVerified?: string;
};

export type Block = { tag: string; text: string; href?: string | null };

export type LandingPage = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  image?: string;
  blocks: Block[];
  images: { src: string; alt: string }[];
  videos?: string[];
  iframes?: string[];
  hasForm?: boolean;
};

export type Video = {
  id: string;
  provider: string;
  title: string;
  description: string;
  pages: string[];
  transcript: string;
};

function interpolateNav(items: NavItem[]): NavItem[] {
  return items.map((item) => ({
    ...item,
    label: interpolateYear(item.label),
    href: interpolateYear(item.href),
    children: item.children ? interpolateNav(item.children) : undefined,
  }));
}

export function getSite(): SiteConfig {
  const raw = JSON.parse(fs.readFileSync(path.join(CONTENT, "site.json"), "utf8"));
  return { ...raw, nav: interpolateNav(raw.nav) };
}

function mdFiles(dir: string): string[] {
  const p = path.join(CONTENT, dir);
  if (!fs.existsSync(p)) return [];
  return fs.readdirSync(p).filter((f) => f.endsWith(".md"));
}

function jsonFiles(dir: string): string[] {
  const p = path.join(CONTENT, dir);
  if (!fs.existsSync(p)) return [];
  return fs.readdirSync(p).filter((f) => f.endsWith(".json"));
}

export function getPosts(): Post[] {
  return mdFiles("posts")
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const { data, content } = matter(
        fs.readFileSync(path.join(CONTENT, "posts", f), "utf8")
      );
      return { slug, body: content, ...(data as Omit<Post, "slug" | "body">) };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  return getPosts().find((p) => p.slug === slug) ?? null;
}

/** Unpublished article drafts awaiting approval in /admin (content/drafts). */
export function getDrafts(): Post[] {
  return mdFiles("drafts")
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const { data, content } = matter(
        fs.readFileSync(path.join(CONTENT, "drafts", f), "utf8")
      );
      return { slug, body: content, ...(data as Omit<Post, "slug" | "body">) };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getDraft(slug: string): Post | null {
  return getDrafts().find((p) => p.slug === slug) ?? null;
}

export function getTools(): Tool[] {
  return jsonFiles("tools").map((f) =>
    JSON.parse(fs.readFileSync(path.join(CONTENT, "tools", f), "utf8"))
  );
}

export function getTool(slug: string): Tool | null {
  return getTools().find((t) => t.slug === slug) ?? null;
}

export function getLandingPages(): LandingPage[] {
  return jsonFiles("pages").map((f) =>
    JSON.parse(fs.readFileSync(path.join(CONTENT, "pages", f), "utf8"))
  );
}

export function getLandingPage(slug: string): LandingPage | null {
  return getLandingPages().find((p) => p.slug === slug) ?? null;
}

export function getLegal(slug: string): { title: string; description: string; body: string } | null {
  const p = path.join(CONTENT, "legal", `${slug}.md`);
  if (!fs.existsSync(p)) return null;
  const { data, content } = matter(fs.readFileSync(p, "utf8"));
  return { title: data.title, description: data.description, body: content };
}

export function getLegalSlugs(): string[] {
  return mdFiles("legal").map((f) => f.replace(/\.md$/, ""));
}

export function getVideos(): Video[] {
  const raw = JSON.parse(
    fs.readFileSync(path.join(CONTENT, "videos.json"), "utf8")
  );
  return raw.videos as Video[];
}

export function getVideosForPage(pathName: string): Video[] {
  return getVideos().filter((v) => v.pages.includes(pathName));
}

/**
 * Landing-page slugs temporarily hidden from nav, sitemap and static
 * pre-rendering — the page itself still resolves if requested directly
 * (dynamicParams is on), it's just no longer linked or promoted anywhere.
 * Remove a slug from here to fully restore it.
 */
const HIDDEN_PAGE_SLUGS = new Set(["free-ai-tools"]);

/** Every public content slug on the site (excluding home). Used by sitemap, llms.txt, md mirrors. */
export function getAllSlugs(): { slug: string; type: "post" | "tool" | "page" | "legal" }[] {
  return [
    ...getPosts().map((p) => ({ slug: p.slug, type: "post" as const })),
    ...getTools().map((t) => ({ slug: t.slug, type: "tool" as const })),
    ...getLandingPages()
      .filter((p) => !HIDDEN_PAGE_SLUGS.has(p.slug))
      .map((p) => ({
        // Tools-directory pages are stored under a year-less base id; their
        // public slug is the current-year canonical one (rolls forward yearly).
        slug: p.slug in TOOLS_PAGE_CATEGORIES ? canonicalToolsSlug(p.slug) : p.slug,
        type: "page" as const,
      })),
    ...getLegalSlugs().map((s) => ({ slug: s, type: "legal" as const })),
  ];
}
