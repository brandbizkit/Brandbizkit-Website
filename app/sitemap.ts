import type { MetadataRoute } from "next";
import { getSite, getAllSlugs, getPosts } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSite();
  const postDates = new Map(getPosts().map((p) => [p.slug, p.updated ?? p.date]));
  return [
    { url: site.url, priority: 1, changeFrequency: "weekly", lastModified: new Date() },
    { url: `${site.url}/connect`, priority: 0.6, changeFrequency: "monthly" },
    ...getAllSlugs().map(({ slug, type }) => ({
      url: `${site.url}/${slug}`,
      priority: type === "post" || type === "tool" ? 0.8 : type === "legal" ? 0.3 : 0.6,
      changeFrequency: "monthly" as const,
      lastModified: postDates.has(slug) ? new Date(postDates.get(slug)!) : new Date(),
    })),
  ];
}
