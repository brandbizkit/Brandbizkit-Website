import { getSite, getPosts } from "@/lib/content";

export const dynamic = "force-static";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET() {
  const site = getSite();
  const items = getPosts()
    .map(
      (p) => `  <item>
    <title>${esc(p.title)}</title>
    <link>${site.url}/${p.slug}</link>
    <guid>${site.url}/${p.slug}</guid>
    <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    <author>${esc(p.author)}</author>
    <description>${esc(p.description)}</description>
  </item>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${esc(site.name)} — Bizkit Insights</title>
  <link>${site.url}</link>
  <description>${esc(site.description)}</description>
  <language>en</language>
${items}
</channel>
</rss>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
