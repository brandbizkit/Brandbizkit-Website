import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { getSite } from "@/lib/content";
import LeadForm from "@/components/LeadForm";
import { StickerPerson, PhotoSlot } from "../_components/People";

export const metadata: Metadata = {
  title: "Connect — BrandBizkit Design Preview",
  robots: { index: false, follow: false },
};

type Mention = { title: string; url: string; source: string; type: string; date: string; quote: string };

function getMentions(): Mention[] {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "mentions.json"), "utf8"));
    return (data.mentions as Mention[]).filter((m) => m.url);
  } catch {
    return [];
  }
}

const SOCIAL_META: Record<string, { label: string; blurb: string; tint: string }> = {
  instagram: { label: "Instagram", blurb: "Daily AI tool tips, brand-building reels, behind-the-scenes.", tint: "var(--coral)" },
  youtube: { label: "YouTube", blurb: "Full AI tool walkthroughs and masterclasses.", tint: "var(--coral)" },
  facebook: { label: "Facebook", blurb: "Community updates and live sessions.", tint: "var(--peri)" },
  linkedin: { label: "LinkedIn", blurb: "AI transformation insights for businesses and teams.", tint: "var(--peri)" },
};

export default function RdConnect() {
  const site = getSite();
  const mentions = getMentions().slice(0, 6);
  const socials = Object.entries(site.social).filter(([, url]) => url);

  return (
    <>
      <section style={{ position: "relative", padding: "60px 0 30px" }}>
        <div aria-hidden className="rd-dots" style={{ position: "absolute", inset: 0, opacity: 0.1 }} />
        <div className="rd-wrap" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "center" }}>
          <div>
            <span className="rd-sticker" style={{ transform: "rotate(-2deg)" }}>Say hi</span>
            <h1 className="rd-rise" style={{ marginTop: 20, fontSize: "clamp(38px,4vw+12px,66px)" }}>
              There are <span className="rd-mark">humans</span> on the other end.
            </h1>
            <p className="rd-lead" style={{ marginTop: 16, maxWidth: "34rem" }}>
              Follow along, watch the tool walkthroughs, or just send a message. We read everything.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <StickerPerson skin="light" shirt="#f3c82e" hair={0} size={112} style={{ marginRight: -18, transform: "rotate(-6deg)" }} />
            <StickerPerson skin="deep" shirt="#697bdc" hair={2} size={128} style={{ zIndex: 1, position: "relative" }} />
            <StickerPerson skin="warm" shirt="#ff4232" hair={1} size={112} style={{ marginLeft: -18, transform: "rotate(6deg)" }} />
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 40 }}>
        <div className="rd-wrap rd-grid-2" style={{ gap: 24 }}>
          {socials.map(([key, url]) => {
            const meta = SOCIAL_META[key] ?? { label: key, blurb: "", tint: "var(--peri)" };
            return (
              <a key={key} href={url} target="_blank" rel="me noopener" className="rd-chunk rd-card-lift" style={{ padding: 0, overflow: "hidden", color: "inherit", display: "block" }}>
                <div style={{ height: 10, background: meta.tint, borderBottom: "3px solid var(--ink)" }} />
                <div style={{ padding: "22px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <div>
                    <strong style={{ fontSize: 18 }}>{meta.label}</strong>
                    <p style={{ marginTop: 4, fontSize: 14, color: "rgba(29,30,32,0.7)" }}>{meta.blurb}</p>
                  </div>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" stroke="#0d141a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {mentions.length > 0 && (
        <section style={{ background: "var(--cream)", borderTop: "3px solid var(--ink)", borderBottom: "3px solid var(--ink)", padding: "70px 0" }}>
          <div className="rd-wrap">
            <h2 className="rd-h2">In the wild</h2>
            <div className="rd-grid-3" style={{ marginTop: 28 }}>
              {mentions.map((m) => (
                <a key={m.url} href={m.url} target="_blank" rel="noopener" className="rd-chunk rd-card-lift" style={{ padding: 20, color: "inherit", display: "block" }}>
                  <span className="rd-tag">{m.source || m.type}</span>
                  <h3 style={{ marginTop: 10, fontSize: 16, lineHeight: 1.35 }}>{m.title}</h3>
                  {m.quote && <p style={{ marginTop: 8, fontSize: 13, color: "rgba(29,30,32,0.68)" }}>&ldquo;{m.quote}&rdquo;</p>}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="rd-section">
        <div className="rd-wrap rd-grid-2" style={{ alignItems: "center" }}>
          <PhotoSlot label="Founders on a call / at desks — candid" ratio="4 / 3" rotate={-2} />
          <div className="rd-chunk" style={{ padding: "30px 32px" }}>
            <span className="rd-eyebrow">Send a message</span>
            <h2 style={{ fontSize: 26, marginTop: 6 }}>Tell us what you&rsquo;re working on</h2>
            <p style={{ marginTop: 8, fontSize: 15, color: "rgba(29,30,32,0.7)" }}>
              We&rsquo;ll get back to you — a real person, usually within a day.
            </p>
            <div style={{ marginTop: 18 }}>
              <LeadForm source="rd-connect" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
