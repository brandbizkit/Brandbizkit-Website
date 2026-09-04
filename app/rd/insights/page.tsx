import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/content";
import { StickerPerson } from "../_components/People";

export const metadata: Metadata = {
  title: "Bizkit Insights — BrandBizkit Design Preview",
  robots: { index: false, follow: false },
};

const TINTS = ["var(--peri)", "var(--coral)", "var(--yellow)", "var(--green)"];

export default function RdInsights() {
  const posts = getPosts();
  const [lead, ...rest] = posts;

  return (
    <>
      <section style={{ position: "relative", padding: "56px 0 24px" }}>
        <div aria-hidden className="rd-dots" style={{ position: "absolute", inset: 0, opacity: 0.1 }} />
        <div className="rd-wrap" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 30, flexWrap: "wrap" }}>
          <div>
            <span className="rd-sticker" style={{ transform: "rotate(-2deg)" }}>From the blog</span>
            <h1 className="rd-rise" style={{ marginTop: 18, fontSize: "clamp(38px,4vw+12px,66px)" }}>
              Bizkit <span className="rd-mark">Insights</span>
            </h1>
            <p className="rd-lead" style={{ marginTop: 14, maxWidth: "34rem" }}>
              Plain-spoken takes on putting AI to work in a small business — written by the people who
              do it every day.
            </p>
          </div>
          <StickerPerson skin="deep" shirt="#697bdc" hair={1} size={120} style={{ transform: "rotate(4deg)" }} />
        </div>
      </section>

      {lead && (
        <section style={{ paddingBottom: 30 }}>
          <div className="rd-wrap">
            <Link href={`/rd/insights/${lead.slug}`} className="rd-chunk rd-card-lift" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", overflow: "hidden", color: "inherit" }}>
              <div style={{ background: TINTS[0], borderRight: "3px solid var(--ink)", minHeight: 240, position: "relative" }}>
                <span className="rd-tag" style={{ position: "absolute", left: 18, top: 18, background: "#fff" }}>Latest</span>
              </div>
              <div style={{ padding: "28px 30px" }}>
                <h2 style={{ fontSize: "clamp(20px,1.4vw+14px,28px)" }}>{lead.title}</h2>
                <p style={{ marginTop: 10, fontSize: 15, color: "rgba(29,30,32,0.72)" }}>{lead.description}</p>
                <p style={{ marginTop: 14, fontSize: 13, color: "rgba(29,30,32,0.55)" }}>{lead.author} · {lead.date}{lead.readTime ? ` · ${lead.readTime}` : ""}</p>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section style={{ paddingBottom: 90 }}>
        <div className="rd-wrap rd-grid-3">
          {rest.map((p, i) => (
            <Link key={p.slug} href={`/rd/insights/${p.slug}`} className="rd-chunk rd-card-lift" style={{ padding: 0, overflow: "hidden", background: "#fff", color: "inherit", display: "block" }}>
              <div style={{ height: 140, background: TINTS[(i + 1) % TINTS.length], borderBottom: "3px solid var(--ink)" }} />
              <div style={{ padding: 20 }}>
                <h3 style={{ fontSize: 17, lineHeight: 1.3 }}>{p.title}</h3>
                <p style={{ marginTop: 8, fontSize: 13, color: "rgba(29,30,32,0.6)" }}>{p.author} · {p.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
