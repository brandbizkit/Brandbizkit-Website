import fs from "fs";
import path from "path";
import { cookies } from "next/headers";

type Kit = {
  name: string;
  stage?: string;
  tagline?: string;
  pricePhp: string;
  priceUsd: string;
  cadence: string;
  popular: boolean;
  features: string[];
  outcome: string;
};

function getPricing(): { heading: string; subheading: string; kits: Kit[] } {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content", "pricing.json"), "utf8")
  );
}

function Check({ popular }: { popular?: boolean }) {
  return (
    <span
      aria-hidden
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
        popular ? "bg-brand-accent/10 text-brand-accent" : "bg-brand-periwinkle/10 text-brand-periwinkle"
      }`}
    >
      ✓
    </span>
  );
}

/**
 * "Biz in a Box" service kits — replicates the live site's pricing cards
 * (Starter Kit / Launch Kit with MOST POPULAR badge / Social Media Management).
 *
 * Pricing shown leads with the visitor's local currency (PHP for Philippines
 * traffic, USD elsewhere) based on the `bk_country` cookie middleware.ts
 * stamps from Vercel's edge geo header — with the other currency shown
 * second for reference, so it's always clear which one is actually charged.
 */
export default async function PricingKits() {
  const pricing = getPricing();
  const cookieStore = await cookies();
  const country = cookieStore.get("bk_country")?.value ?? "PH";
  const isPH = country === "PH";
  return (
    <section className="bg-brand-light py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="section-eyebrow">Biz in a Box</p>
          <h2 className="section-title mt-2">
            <span className="text-brand-accent">brandbizkit</span> services
          </h2>
          <p className="section-sub mx-auto text-center">{pricing.subheading}</p>
        </div>
        <div className="mt-14 grid items-stretch gap-8 lg:grid-cols-3">
          {pricing.kits.map((kit) => (
            <article
              key={kit.name}
              className={`card card-hover relative flex flex-col p-8 ${
                kit.popular ? "z-10 border-2 border-brand-accent lg:-my-3 lg:py-11" : ""
              }`}
            >
              {kit.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-yellow px-4 py-1.5 text-xs font-bold tracking-wide text-brand-ink shadow-md">
                  ★ MOST POPULAR
                </span>
              )}
              {kit.stage && (
                <p className={`text-center text-sm font-bold uppercase tracking-wide ${kit.popular ? "text-brand-accent" : "text-brand-periwinkle-dark"}`}>
                  {kit.stage}
                </p>
              )}
              <h3 className={`mt-1 text-center font-display text-2xl font-bold ${kit.popular ? "text-brand-accent" : "text-brand-ink"}`}>
                {kit.name}
              </h3>
              {kit.tagline && (
                <p className="mt-2 text-center text-sm leading-relaxed text-brand-text/70">{kit.tagline}</p>
              )}
              <p className="mt-4 text-center">
                <span className="font-display text-4xl font-extrabold tracking-tight text-brand-ink">
                  {isPH ? kit.pricePhp : kit.priceUsd}
                </span>
                <span className="text-brand-text/50"> / </span>
                <span className="font-display text-2xl font-bold text-brand-ink">
                  {isPH ? kit.priceUsd : kit.pricePhp}
                </span>
              </p>
              <p className="mt-1 text-center text-sm text-brand-text/55">({kit.cadence})</p>
              <p className="mt-1 text-center text-xs text-brand-text/45">
                {isPH
                  ? "Priced in PHP — USD shown for reference"
                  : "Priced in USD — PHP shown for reference"}
              </p>
              <ul className="mt-7 grid gap-3 border-t border-brand-ink/8 pt-7 text-left text-sm leading-relaxed text-brand-text/90">
                {kit.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check popular={kit.popular} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <div className="mt-7 rounded-xl bg-brand-cream p-4 text-left text-sm">
                  <p className="font-semibold text-brand-ink">✨ Outcome</p>
                  <p className="mt-1 leading-relaxed text-brand-text/80">{kit.outcome}</p>
                </div>
                <a
                  href="#lets-talk"
                  className={`btn mt-7 w-full ${kit.popular ? "btn-primary" : "btn-secondary"}`}
                >
                  Let&apos;s Talk
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
