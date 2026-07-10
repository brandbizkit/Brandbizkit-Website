/**
 * LLM-readable renderings of the entire site.
 *
 * Every page has a canonical markdown form used by:
 *  - /llms.txt          (index + summaries, llmstxt.org spec)
 *  - /llms-full.txt     (full site content in one file)
 *  - /<slug>.md         (per-page markdown mirror, via middleware rewrite)
 */
import {
  getSite,
  getPosts,
  getTools,
  getLandingPages,
  getLegal,
  getLegalSlugs,
  getVideos,
  type Post,
  type Tool,
  type LandingPage,
} from "./content";
import { directoryToMd, getToolsDirectory, matchToolsPageSlug, canonicalToolsSlug } from "./tools-directory";
import { interpolateYear } from "./year";

export function postToMd(p: Post): string {
  // Replace [chart:N] markers with the chart data as markdown tables so the
  // statistics stay fully extractable in the agent-readable mirror.
  let body = p.body.trim();
  const chartTable = (i: number): string => {
    const c = p.charts?.[i];
    if (!c) return "";
    return [
      `**${c.title}**`,
      "",
      "| " + c.data.map((d) => d.label).join(" | ") + " |",
      "|" + c.data.map(() => "---").join("|") + "|",
      "| " + c.data.map((d) => `${d.value}${c.unit ?? ""}`).join(" | ") + " |",
      c.source ? `\n_Source: ${c.source}_` : "",
    ].join("\n");
  };
  body = body.replace(/^\[chart:(\d+)\]$/gm, (_, n) => chartTable(Number(n)));
  const lines = [
    `# ${p.title}`,
    "",
    `> ${p.description}`,
    "",
    `- Author: ${p.author}`,
    `- Published: ${p.date}${p.updated ? ` (updated ${p.updated})` : ""}`,
    p.readTime ? `- Reading time: ${p.readTime}` : "",
    "",
    body,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

export function toolToMd(t: Tool): string {
  return [
    `# ${t.question}`,
    "",
    `> ${t.description}`,
    "",
    ...t.paragraphs.map((p) => p + "\n"),
    t.courseUrl ? `**Free intro course:** ${t.courseUrl}` : "",
    "",
    `Learn ${t.name} with BrandBizkit Ai School: ${getSite().url}/ai-school`,
  ].join("\n");
}

export function landingToMd(p: LandingPage): string {
  // Directory-backed pages render from the weekly-updated tools directory;
  // their h1/description carry a "{YEAR}" token that rolls forward yearly.
  const dirMd = directoryToMd(p.slug);
  if (dirMd) {
    return [
      `# ${interpolateYear(p.h1)}`,
      "",
      `> ${interpolateYear(p.description)}`,
      "",
      dirMd,
    ].join("\n");
  }
  const lines: string[] = [`# ${p.h1}`, "", `> ${p.description}`, ""];
  for (const b of p.blocks) {
    if (b.tag === "h1") continue;
    if (b.tag === "h2") lines.push(`\n## ${b.text}\n`);
    else if (b.tag === "h3") lines.push(`\n### ${b.text}\n`);
    else if (b.tag === "li") lines.push(`- ${b.text}`);
    else if ((b.tag === "a" || b.tag === "button") && b.href)
      lines.push(`[${b.text}](${b.href.startsWith("/") ? getSite().url + b.href : b.href})`);
    else lines.push(`\n${b.text}\n`);
  }
  const named = p.images.filter((i) => i.alt);
  if (named.length > 2) {
    lines.push("\n## Featured items\n");
    for (const i of named) lines.push(`- ${i.alt}`);
  }
  return lines.join("\n");
}

export function pageMd(slug: string): string | null {
  const site = getSite();
  if (slug === "index" || slug === "home") {
    return [
      `# ${site.name} — ${site.tagline}`,
      "",
      `> ${site.description}`,
      "",
      "## Services",
      "1. **Biz in a Box (Solution Design)** — practical, plug-and-play business starter kits. DIY templates, guides, toolkits and automated workflows, or DFY full setup service.",
      "2. **Ai Tools Education (Ai School)** — training, masterclasses, and affiliate tool operations: setup + integration of AI and no-code tools (automation, CRM, funnels, chatbots, analytics).",
      "3. **Ai Transformation (Consulting)** — business impact assessment, AI readiness scan, and strategic AI transformation for organizations.",
      "",
      `Contact: ${site.email} — or the form at ${site.url}/#lets-talk`,
    ].join("\n");
  }
  const post = getPosts().find((p) => p.slug === slug);
  if (post) return postToMd(post);
  const tool = getTools().find((t) => t.slug === slug);
  if (tool) return toolToMd(tool);
  // Tools-directory pages: resolve any requested year (or the bare base) back
  // to the underlying content file, always serving current-year copy.
  const toolsMatch = matchToolsPageSlug(slug);
  const page = getLandingPages().find((p) => p.slug === (toolsMatch ? toolsMatch.base : slug));
  if (page) return landingToMd(page);
  if (getLegalSlugs().includes(slug)) {
    const legal = getLegal(slug)!;
    return `# ${legal.title}\n\n${legal.body.trim()}`;
  }
  return null;
}

function oneLine(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

export function llmsTxt(): string {
  const site = getSite();
  const posts = getPosts();
  const tools = getTools();
  const pages = getLandingPages();
  return [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} is a platform for aspiring entrepreneurs: curated free AI tools, plug-and-play business starter kits (Biz in a Box), AI education (Ai School), and AI transformation consulting. Founded by ${site.founders.map((f) => f.name).join(" and ")}.`,
    "",
    "Every page on this site has a markdown mirror: append `.md` to any URL path.",
    "",
    "## Services",
    `- [Home](${site.url}/index.md): Services overview — Biz in a Box, Ai Tools Education, Ai Transformation`,
    `- [Ai School](${site.url}/ai-school.md): AI tools education, masterclasses and training`,
    "",
    "## AI Tool Guides",
    ...tools.map((t) => `- [${t.question}](${site.url}/${t.slug}.md): ${oneLine(t.description).slice(0, 140)}`),
    "",
    `## Free AI Tool Collections (directory updated ${getToolsDirectory().updatedAt}, refreshed weekly)`,
    ...pages
      .filter((p) => p.slug.includes("ai-tools") || p.slug.includes("ai-image") || p.slug.includes("ai-video") || p.slug.includes("no-code"))
      .map((p) => {
        const slug = canonicalToolsSlug(p.slug);
        const h1 = interpolateYear(p.h1);
        const description = interpolateYear(p.description);
        return `- [${h1}](${site.url}/${slug}.md): ${oneLine(description).slice(0, 140)}`;
      }),
    "",
    "## Bizkit Insights (Articles)",
    ...posts.map((p) => `- [${p.title}](${site.url}/${p.slug}.md): ${oneLine(p.description).slice(0, 140)}`),
    "",
    "## Videos",
    ...getVideos().map((v) => `- ${v.title}: https://www.youtube.com/watch?v=${v.id}`),
    "",
    "## Optional",
    `- [Connect & social profiles](${site.url}/connect)`,
    `- [Full site content](${site.url}/llms-full.txt)`,
    `- [RSS feed](${site.url}/feed.xml)`,
  ].join("\n");
}

export function llmsFullTxt(): string {
  const site = getSite();
  const sections: string[] = [llmsTxt(), "\n\n---\n"];
  sections.push(pageMd("index")!);
  for (const t of getTools()) sections.push("\n---\n\n" + toolToMd(t));
  for (const p of getLandingPages()) sections.push("\n---\n\n" + landingToMd(p));
  for (const p of getPosts()) sections.push("\n---\n\n" + postToMd(p));
  return sections.join("\n") + `\n\n---\nSource: ${site.url} · Generated ${new Date().toISOString().slice(0, 10)}\n`;
}
