import type { Metadata } from "next";
import Link from "next/link";
import { StickerPerson, PhotoSlot } from "../_components/People";

export const metadata: Metadata = {
  title: "Services — BrandBizkit Design Preview",
  robots: { index: false, follow: false },
};

const SERVICES = [
  {
    id: "biz-in-a-box",
    n: "01",
    tint: "var(--coral)",
    name: "Biz in a Box",
    sub: "Solution Design",
    intro: "Practical, plug-and-play business starter kits.",
    rows: [
      { k: "DIY — Do It Yourself", v: "Templates, guides, toolkits and automated workflows you implement on your own." },
      { k: "DFY — Done For You", v: "Full setup service where BrandBizkit designs and implements the system for you." },
    ],
  },
  {
    id: "ai-school",
    n: "02",
    tint: "var(--peri)",
    name: "AI Tools Education",
    sub: "AI School",
    intro: "Helping businesses use AI in their day-to-day.",
    rows: [
      { k: "Training & Masterclasses", v: "Workshops, webinars and private sessions on AI for branding, content, workflows and operations." },
      { k: "Affiliate Tool Operations", v: "Technical setup + integration of AI and no-code tools: automation, CRM, funnels, chatbots, analytics." },
    ],
  },
  {
    id: "transformation",
    n: "03",
    tint: "var(--green)",
    name: "AI Transformation",
    sub: "Consulting",
    intro: "End-to-end AI adoption strategy for organizations.",
    rows: [
      { k: "Problem Diagnosis", v: "Business Impact Assessment + AI Readiness Scan to find gaps, inefficiencies and opportunities." },
      { k: "Strategic Transformation", v: "Redesigning processes, operating models and customer experiences with AI to drive growth and savings." },
    ],
  },
];

export default function RdServices() {
  return (
    <>
      <section style={{ position: "relative", padding: "60px 0 40px" }}>
        <div aria-hidden className="rd-dots" style={{ position: "absolute", inset: 0, opacity: 0.1 }} />
        <div className="rd-wrap" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "center" }}>
          <div>
            <span className="rd-sticker" style={{ transform: "rotate(-2deg)" }}>Our services</span>
            <h1 className="rd-rise" style={{ marginTop: 20, fontSize: "clamp(38px,4vw+12px,68px)" }}>
              Choose your <span className="rd-mark">goal</span>.<br />We&rsquo;ll bring the humans.
            </h1>
            <p className="rd-lead" style={{ marginTop: 18, maxWidth: "34rem" }}>
              Three ways to work with brandbizkit — from a weekend DIY kit to a full AI transformation.
              Every one comes with real people, not just a download link.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: -10 }}>
            <StickerPerson skin="deep" shirt="#f3c82e" hair={1} size={110} style={{ marginRight: -20, transform: "rotate(-6deg)" }} />
            <StickerPerson skin="light" shirt="#ff4232" hair={0} size={128} style={{ zIndex: 1, position: "relative" }} />
            <StickerPerson skin="warm" shirt="#697bdc" hair={2} size={110} style={{ marginLeft: -20, transform: "rotate(6deg)" }} />
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 80 }}>
        <div className="rd-wrap" style={{ display: "grid", gap: 24 }}>
          {SERVICES.map((s) => (
            <div key={s.id} id={s.id} className="rd-chunk" style={{ padding: 0, overflow: "hidden", scrollMarginTop: 90 }}>
              <div style={{ height: 12, background: s.tint, borderBottom: "3px solid var(--ink)" }} />
              <div style={{ padding: "30px 34px", display: "grid", gridTemplateColumns: "auto 1fr", gap: 28 }} className="rd-svc-row">
                <span style={{ fontWeight: 800, fontSize: 56, color: "rgba(13,20,26,0.14)", lineHeight: 1 }}>{s.n}</span>
                <div>
                  <h2 style={{ fontSize: 28 }}>
                    {s.name} <span style={{ color: s.tint }}>({s.sub})</span>
                  </h2>
                  <p style={{ marginTop: 8, fontWeight: 600, color: "rgba(29,30,32,0.7)" }}>{s.intro}</p>
                  <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
                    {s.rows.map((r) => (
                      <div key={r.k} style={{ border: "3px solid var(--ink)", borderRadius: 14, padding: "14px 16px", background: "var(--cream)" }}>
                        <strong style={{ fontSize: 15 }}>{r.k}</strong>
                        <p style={{ marginTop: 4, fontSize: 14, color: "rgba(29,30,32,0.78)" }}>{r.v}</p>
                      </div>
                    ))}
                  </div>
                  <Link href="/rd/growth-score" className="rd-btn coral" style={{ marginTop: 20 }}>Start with a Growth Score →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--ink)", padding: "72px 0" }}>
        <div className="rd-wrap rd-grid-2" style={{ alignItems: "center" }}>
          <PhotoSlot label="Team / workshop photo — 3 people, laughing" ratio="4 / 3" rotate={-2} />
          <div>
            <span className="rd-eyebrow" style={{ color: "var(--yellow)" }}>Not sure which?</span>
            <h2 style={{ color: "#fff", fontSize: "clamp(28px,2.4vw+16px,44px)", marginTop: 8 }}>
              Talk to a human first.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", marginTop: 14, fontSize: 16 }}>
              A 20-minute call to figure out whether you need a kit, a class, or a full transformation —
              no pitch, just a plan.
            </p>
            <Link href="/rd/connect" className="rd-btn" style={{ marginTop: 22 }}>Book a call</Link>
          </div>
        </div>
      </section>

      <style>{`@media (max-width: 720px){ .rd-svc-row { grid-template-columns: 1fr !important; gap: 12px !important; } }`}</style>
    </>
  );
}
