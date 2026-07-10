"use client";

/**
 * "AI BizTool Kits" goal accordion — rebuild of the original free-ai-tools
 * widget: pick a goal, expand a curated list of AI tools (with links) for it.
 */
import { useState } from "react";

export type KitSection = {
  title: string;
  tools: { text: string; link: string }[];
};

export default function BizToolKits({ sections }: { sections: KitSection[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-[0_24px_60px_rgb(13_20_26/0.2)] md:p-8">
      <h3 className="text-center font-display text-2xl font-bold text-brand-ink">
        AI BizTool Kits
      </h3>
      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s, i) => (
          <div key={s.title} className={active === i ? "sm:col-span-2 lg:col-span-3" : ""}>
            <button
              onClick={() => setActive(active === i ? null : i)}
              aria-expanded={active === i}
              className={`flex w-full items-center justify-between gap-2 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${
                active === i
                  ? "border-brand-accent bg-brand-cream text-brand-accent"
                  : "border-brand-ink/15 text-brand-ink hover:border-brand-periwinkle"
              }`}
            >
              <span className="flex items-center gap-2">
                <span aria-hidden>{active === i ? "➡️" : "👤"}</span>
                {s.title}
              </span>
              <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden className={`shrink-0 transition ${active === i ? "rotate-180" : ""}`}>
                <path d="M1 1l4 4 4-4" stroke="currentColor" fill="none" strokeWidth="1.5" />
              </svg>
            </button>
            {active === i && (
              <ul className="mt-2 grid gap-2 rounded-lg bg-brand-light p-4 sm:grid-cols-2">
                {s.tools.map((t) => (
                  <li key={t.text}>
                    <a
                      href={t.link}
                      rel="noopener"
                      target="_blank"
                      className="card block p-3 text-sm text-brand-text/90 transition hover:-translate-y-0.5 hover:border-brand-accent/40 hover:text-brand-accent"
                    >
                      {t.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
