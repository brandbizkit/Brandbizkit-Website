import Link from "next/link";
import type { ToolCategory, ToolsDirectory } from "@/lib/tools-directory";
import ScrollToTopButton from "./ScrollToTopButton";

const PRICING_STYLES: Record<string, string> = {
  free: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  "free-credits": "bg-brand-cream text-brand-orange ring-1 ring-brand-orange/20",
  freemium: "bg-brand-light text-brand-text/70 ring-1 ring-brand-ink/10",
};

const CATEGORY_ICONS: Record<string, string> = {
  "top-ai-image-tools": "🖼️",
  "top-ai-video-tools": "🎬",
  "top-ai-website-app-building-tools": "🧱",
  "top-ai-agents-automation-tools": "🤖",
  "top-ai-design-tools": "🎨",
  "top-ai-voice-transcription-tools": "🎙️",
  "top-ai-coding-assistants": "💻",
  "top-ai-writing-copywriting-tools": "✍️",
  "top-ai-music-audio-tools": "🎵",
  "top-ai-productivity-tools": "🧠",
  "other-free-ai-tools": "🧰",
  "ai-tools-worth-paying-for": "💎",
};

/**
 * Categorized free-AI-tools directory. Data lives in content/tools-directory.json
 * and is refreshed weekly by the automated research agent — the "Last updated"
 * badge doubles as a freshness signal for AI search engines.
 */
export default function ToolsDirectoryView({
  directory,
  categories,
  allToolsHref,
}: {
  directory: ToolsDirectory;
  categories: ToolCategory[];
  /** When set, this page shows a filtered subset of categories — render a
   *  "Show All Tools" button next to the chips that links back to the full,
   *  unfiltered directory. */
  allToolsHref?: string;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-periwinkle/10 px-4 py-1.5 text-sm font-semibold text-brand-periwinkle-dark ring-1 ring-brand-periwinkle/25">
          <span aria-hidden className="h-2 w-2 animate-pulse rounded-full bg-brand-periwinkle" />
          Last updated: {directory.updatedAt}
        </span>
        <span className="text-sm text-brand-text/60">
          Refreshed weekly with the most popular free &amp; free-credit AI tools.
        </span>
      </div>

      {/* Category anchor chips (as on the original page) */}
      <nav aria-label="Tool categories" className="mt-7 flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="rounded-full border border-brand-ink/12 bg-white px-4 py-1.5 text-sm font-medium text-brand-ink shadow-sm transition hover:-translate-y-0.5 hover:border-brand-periwinkle hover:text-brand-periwinkle-dark"
          >
            <span aria-hidden className="mr-1.5">{CATEGORY_ICONS[c.id] ?? "🔧"}</span>
            {c.title.replace(/^Top AI /, "").replace(/ Tools$/, "")}
          </a>
        ))}
        {allToolsHref && (
          <Link
            href={allToolsHref}
            className="rounded-full bg-brand-ink px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-ink/85"
          >
            <span aria-hidden className="mr-1.5">↺</span>
            Show All Tools
          </Link>
        )}
      </nav>

      {categories.map((c) => (
        <section key={c.id} id={c.id} className="mt-16 scroll-mt-24">
          <div className="flex items-center gap-3">
            <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-cream text-xl">
              {CATEGORY_ICONS[c.id] ?? "🔧"}
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold text-brand-ink md:text-3xl">{c.title}</h2>
            </div>
          </div>
          <p className="mt-3 max-w-2xl leading-relaxed text-brand-text/70">{c.blurb}</p>
          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {c.tools.map((t, i) => (
              <article key={t.name} className="card card-hover flex flex-col p-6">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-bold leading-snug text-brand-ink">
                    {i === 0 && (
                      <span aria-hidden title="Top pick" className="mr-1.5">🏆</span>
                    )}
                    {t.name}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      PRICING_STYLES[t.pricing] ?? PRICING_STYLES.freemium
                    }`}
                  >
                    {directory.pricingLabels[t.pricing] ?? t.pricing}
                  </span>
                </div>
                <p className="mt-1.5 text-xs font-semibold text-brand-periwinkle-dark">{t.freeDetails}</p>
                {t.access && (
                  <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-snug text-brand-orange">
                    <span aria-hidden>⚠️</span>
                    <span>{t.access}</span>
                  </p>
                )}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-text/80">{t.why}</p>
                {t.paidPlan && (
                  <p className="mt-3 rounded-lg bg-brand-light p-2.5 text-xs leading-relaxed text-brand-text/70">
                    <span className="font-semibold text-brand-ink">If you outgrow the free tier: </span>
                    {t.paidPlan}
                  </p>
                )}
                <a
                  href={t.url}
                  rel="noopener"
                  target="_blank"
                  className="group mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-accent transition hover:text-brand-accent-hover"
                >
                  Visit {t.name}
                  <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
                </a>
              </article>
            ))}
          </div>
        </section>
      ))}
      <ScrollToTopButton />
    </div>
  );
}
