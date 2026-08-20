import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getAllSlugs,
  getPost,
  getTool,
  getLandingPage,
  getLegal,
  getPosts,
  getVideosForPage,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import {
  articleSchema,
  toolSchema,
  listSchema,
  pageSchema,
  schemaScript,
} from "@/lib/schema";
import { mdToHtml } from "@/lib/markdown";
import {
  getToolsDirectory,
  getCategoriesForPage,
  matchToolsPageSlug,
  canonicalToolsSlug,
} from "@/lib/tools-directory";
import { interpolateYear } from "@/lib/year";
import fs from "fs";
import path from "path";
import ServicesTail from "@/components/ServicesTail";
import InsightArticle from "@/components/InsightArticle";
import InsightsExitPopup from "@/components/InsightsExitPopup";
import VideoWithTranscript from "@/components/VideoWithTranscript";
import BlockRenderer from "@/components/BlockRenderer";
import ToolsDirectoryView from "@/components/ToolsDirectory";
import ToolCategoryButtons from "@/components/ToolCategoryButtons";
import WannaLearn from "@/components/WannaLearn";
import ChatGptTools from "@/components/ChatGptTools";
import PopularAiToolsGrid from "@/components/PopularAiToolsGrid";
import BrandLaunchKit from "@/components/BrandLaunchKit";
import { parsePersonaAnswers, getPersonalizedKit } from "@/lib/persona-kits";
import BizToolKits, { type KitSection } from "@/components/BizToolKits";
import AiSchoolLeadForm from "@/components/AiSchoolLeadForm";
import PricingKits from "@/components/PricingKits";

export function generateStaticParams() {
  return getAllSlugs().map(({ slug }) => ({ slug }));
}

// Tools-directory pages carry a year in their URL (e.g. /top-free-ai-tools-2026)
// that rolls forward every January. Past-year URLs must still resolve (and
// redirect) rather than 404, so this route renders on-demand for any slug not
// captured by generateStaticParams instead of hard-404ing immediately.
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (post)
    return buildMetadata({
      title: post.title,
      description: post.description,
      pathName: `/${slug}`,
      image: post.image,
      type: "article",
      publishedTime: post.date,
    });
  const tool = getTool(slug);
  if (tool)
    return buildMetadata({
      title: tool.title,
      description: tool.description,
      pathName: `/${slug}`,
      image: tool.image,
    });
  const toolsMatch = matchToolsPageSlug(slug);
  if (toolsMatch) {
    const dirPage = getLandingPage(toolsMatch.base);
    if (dirPage)
      return buildMetadata({
        title: interpolateYear(dirPage.title),
        description: interpolateYear(dirPage.description),
        // Always point canonical at the current-year URL, even if this
        // request came in on a past-year one that's about to redirect.
        pathName: `/${toolsMatch.canonicalSlug}`,
        image: dirPage.image,
      });
  }
  const page = getLandingPage(slug);
  if (page)
    return buildMetadata({
      title: page.title,
      description: page.description,
      pathName: `/${slug}`,
      image: page.image,
      noindex: slug === "free-ai-tools",
    });
  const legal = getLegal(slug);
  if (legal)
    return buildMetadata({
      title: `${legal.title} | BrandBizkit`,
      description: legal.description,
      pathName: `/${slug}`,
    });
  return {};
}

function Videos({ pathName }: { pathName: string }) {
  const videos = getVideosForPage(pathName);
  if (videos.length === 0) return null;
  return (
    <section className="mx-auto max-w-4xl px-4 pb-12">
      <h2 className="font-display text-2xl font-bold text-brand-ink">Watch &amp; Learn</h2>
      <div className="mt-6 grid gap-6">
        {videos.map((v) => (
          <VideoWithTranscript key={v.id} video={v} />
        ))}
      </div>
    </section>
  );
}

export default async function ContentPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const pathName = `/${slug}`;

  // ---- Insight article ----
  const post = getPost(slug);
  if (post) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaScript(articleSchema(post)) }}
        />
        <InsightArticle post={post} />
        <Videos pathName={pathName} />
        <ServicesTail source={slug} />
        <InsightsExitPopup />
      </>
    );
  }

  // ---- Tool profile ----
  const tool = getTool(slug);
  if (tool) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaScript(toolSchema(tool)) }}
        />
        <section className="mx-auto max-w-4xl px-4 py-16">
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">{tool.question}</h1>
          {tool.tagline && (
            <p className="mt-3 text-lg font-medium text-brand-accent">{tool.tagline}</p>
          )}
          {tool.image && (
            <Image
              src={tool.image}
              alt={`${tool.name} overview`}
              width={1024}
              height={434}
              priority
              className="mt-8 w-full rounded-2xl object-cover shadow-[0_18px_44px_rgb(13_20_26/0.12)]"
            />
          )}
          {/* Direct answer block first — extractable by AI engines */}
          <div className="mt-8 grid gap-4 text-lg leading-relaxed text-brand-text/90">
            {tool.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          {tool.courseUrl && (
            <div className="card mt-10 border-brand-orange/25 bg-brand-cream p-8 text-center">
              <h2 className="font-display text-2xl font-bold">
                Free {tool.name} Intro Course
              </h2>
              <p className="mt-2 text-brand-text/80">
                Get your free {tool.name} introduction course below.
              </p>
              <a
                href={tool.courseUrl}
                rel="noopener"
                className="btn btn-quiz mt-5 px-8 font-bold"
              >
                {tool.courseLabel ?? "FREE COURSE"}
              </a>
            </div>
          )}
        </section>

        {/* Capability cards — on-brand periwinkle band (was a hardcoded green) */}
        {tool.capabilities && (
          <section className="bg-brand-periwinkle-dark py-16 text-white">
            <div className="mx-auto max-w-6xl px-4">
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-center font-display text-3xl font-bold text-white">
                  {tool.capabilities.heading}
                </h2>
                {tool.lastVerified && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-white/85 ring-1 ring-white/20">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-yellow" />
                    Last verified {tool.lastVerified}
                  </span>
                )}
              </div>
              <p className="mt-2 text-center text-white/80">{tool.capabilities.sub}</p>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {tool.capabilities.items.map((c) => (
                  <article
                    key={c.title}
                    className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur transition duration-200 hover:-translate-y-1.5 hover:bg-white/15"
                  >
                    <h3 className="font-display text-lg font-bold text-white">{c.title}</h3>
                    <p className="mt-2 text-sm text-white/85">{c.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {tool.howItWorks && (
          <section className="bg-brand-ink py-16 text-white">
            <div className="mx-auto max-w-6xl px-4">
              <h2 className="text-center font-display text-3xl font-bold text-white">
                {tool.howItWorks.heading}
              </h2>
              <p className="mt-2 text-center text-white/80">{tool.howItWorks.sub}</p>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {tool.howItWorks.steps.map((s, i) => (
                  <article key={s.title} className="rounded-2xl border border-white/10 bg-white/10 p-6 transition duration-200 hover:-translate-y-1.5 hover:bg-white/15">
                    <p className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-accent font-display font-bold text-white">
                      {i + 1}
                    </p>
                    <h3 className="mt-3 font-display text-lg font-bold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm text-white/85">{s.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <WannaLearn
          heading={`Wanna learn how to ${tool.name}?`}
          body={`We can help you get started using ${tool.name} and other related AI tools. If you already are a user we can help you level up your game, teach you new ways of using it and enhance your output and productivity with super efficient prompts.`}
        />
        <ToolCategoryButtons />
        <Videos pathName={pathName} />
        <ServicesTail source={slug} />
      </>
    );
  }

  // ---- Legal ----
  const legal = getLegal(slug);
  if (legal) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: schemaScript(
              pageSchema({ pathName, title: legal.title, description: legal.description })
            ),
          }}
        />
        <section className="bg-white py-16">
          <div className="mx-auto max-w-3xl px-4">
            <h1 className="font-display text-3xl font-bold">{legal.title}</h1>
            <div
              className="prose-bb mt-6"
              dangerouslySetInnerHTML={{ __html: mdToHtml(legal.body) }}
            />
          </div>
        </section>
      </>
    );
  }

  // ---- Free-AI-tools directory pages (auto-updated weekly, URL year auto-rolls) ----
  const toolsMatch = matchToolsPageSlug(slug);
  if (toolsMatch) {
    // Past-year (or otherwise non-canonical) requests permanently redirect to
    // the current-year URL — same rollover the headline gets, applied to the
    // address bar too, so old links/bookmarks keep working.
    if (slug !== toolsMatch.canonicalSlug) {
      permanentRedirect(`/${toolsMatch.canonicalSlug}`);
    }
    const dirPage = getLandingPage(toolsMatch.base);
    const directoryCategories = getCategoriesForPage(toolsMatch.base);
    if (dirPage && directoryCategories) {
      const directory = getToolsDirectory();
      const h1 = interpolateYear(dirPage.h1);
      const description = interpolateYear(dirPage.description);
      const site = { url: "https://brandbizkit.com" };
      const dirSchema = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": `${site.url}${pathName}`,
            url: `${site.url}${pathName}`,
            name: interpolateYear(dirPage.title),
            description,
            dateModified: directory.updatedAt,
            inLanguage: "en",
          },
          ...directoryCategories.map((c) => ({
            "@type": "ItemList",
            name: c.title,
            description: c.blurb,
            itemListElement: c.tools.map((t, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: t.name,
              url: t.url,
              description: `${t.freeDetails} — ${t.why}`,
            })),
          })),
        ],
      };
      return (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: schemaScript(dirSchema) }}
          />
          <div className="mx-auto max-w-6xl px-4 pt-16">
            <p className="section-eyebrow">Free AI tools directory</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">{h1}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-brand-text/75">{description}</p>
          </div>
          <div className="mt-8">
            <ToolsDirectoryView
              directory={directory}
              categories={directoryCategories}
              allToolsHref={
                toolsMatch.base === "top-free-ai-tools"
                  ? undefined
                  : `/${canonicalToolsSlug("top-free-ai-tools")}`
              }
            />
          </div>
          <Videos pathName={pathName} />
          <ServicesTail source={toolsMatch.base} />
        </>
      );
    }
  }

  // ---- free-ai-tools: bespoke layout (Choose Your Goal + BizTool Kits + GPT tools) ----
  if (slug === "free-ai-tools") {
    const page = getLandingPage(slug)!;
    const kits: KitSection[] = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "content", "biztool-kits.json"), "utf8")
    );
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaScript(listSchema(page)) }}
        />
        {/* Choose Your Goal — red gradient band with the BizTool Kits accordion */}
        <section className="bg-gradient-to-br from-[#FF4B2B] to-[#FF416C] py-16">
          <div className="mx-auto max-w-5xl px-4">
            <p className="section-eyebrow block text-center !text-white/80">Free AI tools</p>
            <h1 className="mt-2 text-center font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
              Choose Your Goal
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-center text-white/90">
              Launch your brand effortlessly with our free AI tools kit recommendations and
              step-by-step guidance.
            </p>
            <div className="mt-10">
              <BizToolKits sections={kits} />
            </div>
          </div>
        </section>
        <ChatGptTools />
        <ToolCategoryButtons />
        <WannaLearn />
        <ServicesTail source={slug} />
      </>
    );
  }

  // ---- popular-ai-tools: bespoke layout (AI Powered Workflows + GPT tools) ----
  if (slug === "popular-ai-tools") {
    const page = getLandingPage(slug)!;
    const workflows = [
      {
        title: "Idea Finding & Validation Workflow",
        text: "Get your free idea validation workflow guide by signing up below.",
        image: "/assets/idea-finding-workflow-mv0P50oqLlcEDBqx.png",
        href: "/downloads/idea-finding-workflow-Yg24L24wzesQZyN1.pdf",
      },
      {
        title: "Social Media Workflow",
        text: "Your free AI-powered Social Media Workflow guide for small businesses and startups.",
        image: "/assets/social-media-workflow-YKb81bwRlQT65wyQ.png",
        href: "/downloads/transform-your-business-with-ai-powered-workflows-mjE45QO8gaI5PxrR.pdf",
      },
      {
        title: "Lead Generation Workflow",
        text: "Your free step-by-step guide to getting leads using low cost or completely free methods.",
        image: "/assets/lead-generation-workflow-ALp2Bp8g2jIapey8.png",
        href: "/downloads/lead-generation-workflow-AGBzMVXLZQf1WRyD.pdf",
      },
    ];
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaScript(listSchema(page)) }}
        />
        <PopularAiToolsGrid headingLevel="h1" />
        <ToolCategoryButtons />
        <section className="bg-brand-light py-16">
          <div className="mx-auto max-w-6xl px-4">
            <p className="section-eyebrow block text-center">Free guides</p>
            <h2 className="mt-2 text-center font-display text-4xl font-bold tracking-tight md:text-5xl">AI Powered Workflows</h2>
            <p className="section-sub mx-auto text-center">
              Build your brand with free AI powered workflows for developing and verifying new
              ideas, handling social media, and lead generation
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {workflows.map((w) => (
                <article key={w.title} className="card card-hover flex flex-col p-6">
                  <Image
                    src={w.image}
                    alt={w.title}
                    width={480}
                    height={270}
                    className="w-full rounded-xl object-cover"
                  />
                  <h3 className="mt-4 font-display text-lg font-bold">{w.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-brand-text/80">{w.text}</p>
                  <a
                    href={w.href}
                    className="btn btn-primary mt-5 w-full"
                  >
                    Get Your Free Guide
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
        <WannaLearn />
        <ServicesTail source={slug} />
      </>
    );
  }

  // ---- ai-school: bespoke layout (hero + qualifying signup form + pricing) ----
  if (slug === "ai-school") {
    const page = getLandingPage(slug)!;
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaScript(listSchema(page)) }}
        />
        <section className="bg-white py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
            <div>
              <p className="section-eyebrow">Ai School</p>
              <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
                {page.h1}
              </h1>
              <p className="section-sub">
                We create customized 1-on-1 classes and online group sessions for companies and
                individuals that want to learn more about AI and how to implement AI in their
                daily workflows.
              </p>
              {page.image && (
                <Image
                  src={page.image}
                  alt="AI School — hands-on AI training"
                  width={640}
                  height={400}
                  className="mt-8 w-full rounded-2xl object-cover shadow-[0_18px_44px_rgb(13_20_26/0.12)]"
                />
              )}
            </div>
            <div>
              <AiSchoolLeadForm />
            </div>
          </div>
        </section>
        <PricingKits />
        <Videos pathName={pathName} />
      </>
    );
  }

  // ---- Landing / listicle pages ----
  const page = getLandingPage(slug);
  if (page) {
    const isNewsIndex = slug === "ai-news";
    const isPersonaResult = slug.endsWith("-persona-quiz");
    let kit: { tools: string[]; note: string | null } | undefined;
    if (isPersonaResult) {
      const sp = await searchParams;
      const answers = parsePersonaAnswers(sp);
      kit = getPersonalizedKit(slug, answers);
    }
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaScript(listSchema(page)) }}
        />
        <BlockRenderer
          page={page}
          bannerImage={isPersonaResult && page.images[0] ? page.images[0] : undefined}
        />
        {kit && <BrandLaunchKit toolNames={kit.tools} note={kit.note} />}
        {isPersonaResult && (
          <p className="mx-auto max-w-4xl px-4 pb-8">
            <Link
              href="/#persona-quiz"
              className="btn border-2 border-brand-orange font-semibold text-brand-orange hover:bg-brand-orange hover:text-white"
            >
              ↻ Retake the Persona Quiz
            </Link>
          </p>
        )}
        {isNewsIndex && (
          <section className="mx-auto max-w-6xl px-4 pb-12">
            <h2 className="font-display text-2xl font-bold">All Bizkit Insights</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {getPosts().map((p) => (
                <Link
                  key={p.slug}
                  href={`/${p.slug}`}
                  className="card card-hover group overflow-hidden"
                >
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.title}
                      width={480}
                      height={204}
                      className="h-40 w-full object-cover"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="font-display font-semibold leading-snug text-brand-ink group-hover:text-brand-periwinkle">
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-brand-text/70">{p.description}</p>
                    <p className="mt-3 text-xs text-brand-text/50">
                      {p.author} · {p.date}
                      {p.readTime ? ` · ${p.readTime}` : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
        <Videos pathName={pathName} />
        <ServicesTail source={slug} />
        {isNewsIndex && <InsightsExitPopup />}
      </>
    );
  }

  notFound();
}
