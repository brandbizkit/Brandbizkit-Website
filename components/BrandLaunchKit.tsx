import { findDirectoryTool, canonicalToolsSlug } from "@/lib/tools-directory";

const PRICING_STYLES: Record<string, string> = {
  free: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  "free-credits": "bg-brand-cream text-brand-orange ring-1 ring-brand-orange/20",
  freemium: "bg-brand-light text-brand-text/70 ring-1 ring-brand-ink/10",
};

const PRICING_LABELS: Record<string, string> = {
  free: "100% Free",
  "free-credits": "Free credits",
  freemium: "Free plan",
};

/**
 * Persona-quiz "Brand Launch Kit" — a short, curated set of free AI tools for
 * that persona's stage. Pulls live descriptions/pricing straight from
 * content/tools-directory.json (see lib/persona-kits.ts for the selection),
 * so this never drifts out of sync with the main tools directory.
 */
export default function BrandLaunchKit({
  toolNames,
  note,
}: {
  toolNames: string[];
  /** Personalized blurb from getPersonalizedKit() — falls back to a generic line. */
  note?: string | null;
}) {
  const tools = toolNames.map((name) => findDirectoryTool(name)).filter((t) => t !== null);
  if (tools.length === 0) return null;

  return (
    <section className="mx-auto max-w-4xl px-4 pb-8">
      <div className="rounded-3xl border border-brand-ink/8 bg-brand-light p-6 md:p-8">
        <p className="section-eyebrow">Your AI starter kit</p>
        <h2 className="mt-1 font-display text-2xl font-bold text-brand-ink md:text-3xl">
          Free AI tools for your situation
        </h2>
        <p className="mt-2 text-brand-text/75">
          {note ?? "Picked for where you are right now — every tool below is free to start, no card required."}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {tools.map((t) => (
            <article key={t.name} className="card card-hover flex flex-col bg-white p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-base font-bold text-brand-ink">{t.name}</h3>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    PRICING_STYLES[t.pricing] ?? PRICING_STYLES.freemium
                  }`}
                >
                  {PRICING_LABELS[t.pricing] ?? t.pricing}
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-brand-periwinkle-dark">{t.freeDetails}</p>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-brand-text/80">{t.why}</p>
              <a
                href={t.url}
                rel="noopener"
                target="_blank"
                className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-accent transition hover:text-brand-accent-hover"
              >
                Visit {t.name}
                <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
              </a>
            </article>
          ))}
        </div>
        <a
          href={`/${canonicalToolsSlug("top-free-ai-tools")}`}
          className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-ink underline decoration-brand-ink/30 underline-offset-4 transition hover:text-brand-accent hover:decoration-brand-accent"
        >
          See every free AI tool →
        </a>
      </div>
    </section>
  );
}
