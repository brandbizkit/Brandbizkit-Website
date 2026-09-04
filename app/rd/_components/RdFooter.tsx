import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";
import { PeopleHuddle } from "./People";

const COLS = [
  {
    head: "Explore",
    links: [
      { label: "Free AI Tools", href: "/rd/tools" },
      { label: "Growth Score", href: "/rd/growth-score" },
      { label: "Insights", href: "/rd/insights" },
    ],
  },
  {
    head: "Services",
    links: [
      { label: "Biz in a Box", href: "/rd/services#biz-in-a-box" },
      { label: "AI School", href: "/rd/ai-school" },
      { label: "AI Transformation", href: "/rd/services#transformation" },
    ],
  },
  {
    head: "Company",
    links: [
      { label: "Connect & Mentions", href: "/rd/connect" },
      { label: "Terms", href: "/terms-and-conditions" },
      { label: "Privacy", href: "/privacy-policy" },
    ],
  },
];

export default function RdFooter() {
  return (
    <footer style={{ background: "var(--ink)", color: "#fff", padding: "76px 0 40px" }}>
      <div className="rd-wrap">
        <div
          className="rd-chunk"
          style={{
            background: "var(--yellow)", color: "var(--ink)", padding: "32px 36px",
            display: "grid", gridTemplateColumns: "1fr auto", gap: 26, alignItems: "center",
            transform: "rotate(-1deg)",
          }}
        >
          <div>
            <h3 style={{ fontSize: 25 }}>One useful AI trick a week.</h3>
            <p style={{ marginTop: 6, fontSize: 15, color: "rgba(13,20,26,0.8)" }}>
              No spam, no fluff — just something you can use that day.
            </p>
          </div>
          <div style={{ minWidth: 280 }}>
            <NewsletterSignup source="rd-footer" variant="light" />
          </div>
        </div>

        <div style={{ marginTop: 52, display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 30 }} className="rd-foot-cols">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  display: "inline-flex", width: 30, height: 30, alignItems: "center", justifyContent: "center",
                  background: "var(--coral)", border: "3px solid #fff", borderRadius: 9, transform: "rotate(-6deg)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.9 5.9 21.4l1.4-6.8L2.2 9.9l6.9-.8L12 2z" fill="#fff" />
                </svg>
              </span>
              <strong style={{ fontSize: 19 }}>brandbizkit</strong>
            </div>
            <p style={{ marginTop: 14, fontSize: 14, color: "rgba(255,255,255,0.6)", maxWidth: "22rem" }}>
              Real people helping you put AI to work — whether you&rsquo;re launching a brand, running a
              business, or leveling up at your job.
            </p>
            <PeopleHuddle className="rd-foot-people" />
          </div>
          {COLS.map((c) => (
            <div key={c.head}>
              <p style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                {c.head}
              </p>
              <ul style={{ marginTop: 12, display: "grid", gap: 8, fontSize: 14 }}>
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} style={{ color: "#fff", fontWeight: 500 }}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 44, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          © {new Date().getFullYear()} brandbizkit. Made by humans for founders who&rsquo;d rather build than fiddle.
          <span style={{ marginLeft: 10, opacity: 0.7 }}>· /rd design preview</span>
        </p>
      </div>

      <style>{`
        .rd-foot-people { margin-top: 18px; }
        @media (max-width: 900px) { .rd-foot-cols { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .rd-foot-cols { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
