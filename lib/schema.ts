/**
 * Automated JSON-LD schema generation.
 *
 * Every page's structured data is derived from its content collection entry —
 * no manual schema work. Add a post/tool/page file and its schema ships with it.
 */
import { getSite, getVideosForPage, type Post, type Tool, type LandingPage } from "./content";

type JsonLd = Record<string, unknown>;

export function absolute(pathOrUrl: string | undefined): string | undefined {
  if (!pathOrUrl) return undefined;
  const site = getSite();
  return pathOrUrl.startsWith("http") ? pathOrUrl : `${site.url}${pathOrUrl}`;
}

export function organizationSchema(): JsonLd {
  const site = getSite();
  return {
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: { "@type": "ImageObject", url: absolute(site.logo) },
    description: site.description,
    email: site.email,
    founder: site.founders.map((f) => ({ "@type": "Person", name: f.name })),
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

export function webSiteSchema(): JsonLd {
  const site = getSite();
  return {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en",
    keywords: site.keywords,
    publisher: { "@id": `${site.url}/#organization` },
  };
}

function breadcrumb(pathName: string, title: string): JsonLd {
  const site = getSite();
  const items: JsonLd[] = [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
  ];
  if (pathName !== "/") {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: title,
      item: `${site.url}${pathName}`,
    });
  }
  return { "@type": "BreadcrumbList", itemListElement: items };
}

export function videoSchemas(pathName: string): JsonLd[] {
  return getVideosForPage(pathName).map((v) => ({
    "@type": "VideoObject",
    name: v.title,
    description: v.description,
    embedUrl: `https://www.youtube.com/embed/${v.id}`,
    contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
    uploadDate: "2025-01-01",
    ...(v.transcript ? { transcript: v.transcript } : {}),
  }));
}

function graph(nodes: JsonLd[]): JsonLd {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function pageSchema(page: {
  pathName: string;
  title: string;
  description: string;
  image?: string;
}): JsonLd {
  const site = getSite();
  return graph([
    organizationSchema(),
    webSiteSchema(),
    {
      "@type": "WebPage",
      "@id": `${site.url}${page.pathName}`,
      url: `${site.url}${page.pathName}`,
      name: page.title,
      description: page.description,
      inLanguage: "en",
      isPartOf: { "@id": `${site.url}/#website` },
      ...(page.image ? { primaryImageOfPage: { "@type": "ImageObject", url: absolute(page.image) } } : {}),
    },
    breadcrumb(page.pathName, page.title),
    ...videoSchemas(page.pathName),
  ]);
}

export function articleSchema(post: Post): JsonLd {
  const site = getSite();
  const pathName = `/${post.slug}`;
  return graph([
    organizationSchema(),
    webSiteSchema(),
    {
      "@type": "BlogPosting",
      "@id": `${site.url}${pathName}`,
      mainEntityOfPage: `${site.url}${pathName}`,
      headline: post.title,
      description: post.description,
      image: absolute(post.image),
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      inLanguage: "en",
      author: { "@type": "Person", name: post.author },
      publisher: { "@id": `${site.url}/#organization` },
    },
    breadcrumb(pathName, post.title),
    ...videoSchemas(pathName),
  ]);
}

export function toolSchema(tool: Tool): JsonLd {
  const site = getSite();
  const pathName = `/${tool.slug}`;
  return graph([
    organizationSchema(),
    webSiteSchema(),
    {
      "@type": "Article",
      "@id": `${site.url}${pathName}`,
      headline: tool.question,
      description: tool.description,
      image: absolute(tool.image),
      inLanguage: "en",
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      about: {
        "@type": "SoftwareApplication",
        name: tool.name,
        applicationCategory: "AI Tool",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free tier available" },
      },
    },
    // Q&A extraction target for "What is X?" queries
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: tool.question,
          acceptedAnswer: { "@type": "Answer", text: tool.paragraphs[0] ?? tool.description },
        },
      ],
    },
    breadcrumb(pathName, tool.question),
    ...videoSchemas(pathName),
  ]);
}

export function listSchema(page: LandingPage): JsonLd {
  const site = getSite();
  const pathName = `/${page.slug}`;
  const tools = page.images
    .filter((i) => i.alt && i.alt.length > 1)
    .slice(0, 30);
  return graph([
    organizationSchema(),
    webSiteSchema(),
    {
      "@type": "WebPage",
      "@id": `${site.url}${pathName}`,
      url: `${site.url}${pathName}`,
      name: page.title,
      description: page.description,
      inLanguage: "en",
      isPartOf: { "@id": `${site.url}/#website` },
    },
    ...(tools.length > 2
      ? [
          {
            "@type": "ItemList",
            name: page.h1,
            itemListElement: tools.map((t, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: t.alt,
            })),
          },
        ]
      : []),
    breadcrumb(pathName, page.h1),
    ...videoSchemas(pathName),
  ]);
}

export function schemaScript(schema: JsonLd): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
