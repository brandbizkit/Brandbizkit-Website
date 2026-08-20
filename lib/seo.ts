import type { Metadata } from "next";
import { getSite } from "./content";
import { absolute } from "./schema";

export function buildMetadata(input: {
  title: string;
  description: string;
  pathName: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
  noindex?: boolean;
}): Metadata {
  const site = getSite();
  const url = `${site.url}${input.pathName === "/" ? "" : input.pathName}`;
  const image = absolute(input.image) ?? absolute(site.logoIcon)!;
  return {
    title: input.title,
    description: input.description,
    metadataBase: new URL(site.url),
    alternates: {
      canonical: url,
      types: {
        // markdown mirror for AI agents
        "text/markdown": `${url === site.url ? site.url + "/index" : url}.md`,
      },
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: site.name,
      type: input.type ?? "website",
      images: [{ url: image }],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
    },
    robots: input.noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
