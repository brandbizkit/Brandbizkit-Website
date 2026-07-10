import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";

/**
 * AI-search-friendly robots: explicitly welcome every citation-capable AI
 * crawler (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot).
 * Blocking these means those engines cannot cite BrandBizkit.
 */
export default function robots(): MetadataRoute.Robots {
  const site = getSite();
  const aiBots = [
    "GPTBot",
    "ChatGPT-User",
    "ClaudeBot",
    "anthropic-ai",
    "PerplexityBot",
    "Google-Extended",
    "Bingbot",
    "Applebot-Extended",
  ];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
      ...aiBots.map((bot) => ({ userAgent: bot, allow: "/" as const })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
