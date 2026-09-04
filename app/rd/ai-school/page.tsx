import type { Metadata } from "next";
import LeadForm from "@/components/LeadForm";
import { StickerPerson, PhotoSlot } from "../_components/People";

export const metadata: Metadata = {
  title: "AI School — BrandBizkit Design Preview",
  robots: { index: false, follow: false },
};

const FORMATS = [
  { title: "1-on-1 classes", body: "Customized private sessions built around your business and the tools you actually use." },
  { title: "Online group sessions", body: "Small cohorts for teams and individuals — live, hands-on, real use cases." },
  { title: "Company workshops", body: "Bring AI into your team's daily workflows: content, ops, support, analytics." },
];

const OUTCOMES = [
  "Real tools, not theory",
  "Real workflows you keep",
  "Real results in weeks, not quarters",
];

export default function RdAiSchool() {
  return (
    <>
      <section style={{ position: "relative", background: "var(--peri)", borderBottom: "3px solid var(--ink)", padding: "64px 0" }}>
        <div aria-hidden className="rd-dots" style={{ position: "absolute", inset: 0, opacity: 0.1 }} />
        <div className="rd-wrap" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 40, alignItems: "center" }} >
          <div>
            <span className="rd-sticker" style={{ transform: "rotate(-2deg)", background: "var(--yellow)" }}>AI School</span>
            <h1 className="rd-rise" style={{ marginTop: 20, color: "#fff", fontSize: "clamp(38px,4vw+12px,66px)" }}>
              We demystify AI with <span className="rd-mark">real</span> tools &amp; real people.
            </h1>
            <p className="rd-rise" style={{ marginTop: 18, fontSize: 18, color: "rgba(255,255,255,0.9)", maxWidth: "34rem" }}>
              Customized 1-on-1 classes and online group sessions for companies and individuals who want
              to learn AI and actually implement it in their daily workflows.
            </p>
            <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {OUTCOMES.map((o) => (
                <span key={o} className="rd-sticker" style={{ background: "#fff" }}>{o}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <StickerPerson skin="deep" shirt="#ff4232" hair={1} size={104} style={{ marginRight: -18, transform: "rotate(-6deg)" }} />
            <StickerPerson skin="light" shirt="#f3c82e" hair={3} size={124} style={{ zIndex: 1, position: "relative" }} />
            <StickerPerson skin="warm" shirt="#0e5c46" hair={2} size={104} style={{ marginLeft: -18, transform: "rotate(6deg)" }} />
          </div>
        </div>
      </section>

      <section className="rd-section">
        <div className="rd-wrap">
          <h2 className="rd-h2" style={{ textAlign: "center" }}>How it&rsquo;s run</h2>
          <div className="rd-grid-3" style={{ marginTop: 34 }}>
            {FORMATS.map((f, i) => (
              <div key={f.title} className="rd-chunk rd-card-lift" style={{ padding: 24 }}>
                <span className="rd-tag" style={{ background: [ "var(--coral)", "var(--peri)", "var(--yellow)" ][i] }}>0{i + 1}</span>
                <h3 style={{ marginTop: 12, fontSize: 20 }}>{f.title}</h3>
                <p style={{ marginTop: 8, fontSize: 14, color: "rgba(29,30,32,0.75)" }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--cream)", borderTop: "3px solid var(--ink)", borderBottom: "3px solid var(--ink)", padding: "72px 0" }}>
        <div className="rd-wrap rd-grid-2" style={{ alignItems: "center" }}>
          <PhotoSlot label="Class in session — instructor + students at a table" ratio="4 / 3" rotate={2} />
          <div>
            <span className="rd-eyebrow">Who it&rsquo;s for</span>
            <h2 className="rd-h2" style={{ marginTop: 8 }}>Founders, professionals &amp; teams</h2>
            <p className="rd-lead" style={{ marginTop: 14 }}>
              Whether you&rsquo;re a startup founder, a working professional, or a business ready to
              integrate AI into operations — we meet you where you are.
            </p>
          </div>
        </div>
      </section>

      <section className="rd-section">
        <div className="rd-wrap" style={{ maxWidth: 640 }}>
          <div className="rd-chunk" style={{ padding: "32px 34px" }}>
            <span className="rd-eyebrow">Sign up for AI School</span>
            <h2 style={{ fontSize: 28, marginTop: 6 }}>Tell us what you want to learn</h2>
            <p style={{ marginTop: 8, fontSize: 15, color: "rgba(29,30,32,0.7)" }}>
              We&rsquo;ll come back with a class outline and dates. Launch your brand with free AI tools today.
            </p>
            <div style={{ marginTop: 18 }}>
              <LeadForm source="rd-ai-school" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
