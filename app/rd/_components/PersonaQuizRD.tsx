"use client";

import { useState } from "react";
import Link from "next/link";

type PersonaId = "launch" | "run" | "job";

const PERSONAS: { id: PersonaId; tag: string; label: string }[] = [
  { id: "launch", tag: "Start from zero", label: "I’m launching a brand" },
  { id: "run", tag: "Level up ops", label: "I already run a business" },
  { id: "job", tag: "Skill up fast", label: "I want to use AI better at work" },
];

const REC: Record<PersonaId, { title: string; bullets: string[] }> = {
  launch: {
    title: "Your BizKit — Launch Pad",
    bullets: [
      "Biz in a Box DIY kit: brand, site and socials up in a weekend",
      "Free AI tools for naming, identity and your first content batch",
      "Run the Growth Score to pressure-test the idea before you spend",
    ],
  },
  run: {
    title: "Your BizKit — Operator Upgrade",
    bullets: [
      "An automation + CRM tool stack that kills the daily busywork",
      "AI School masterclass on workflows, funnels and chatbots",
      "AI Transformation assessment when you’re ready for bigger moves",
    ],
  },
  job: {
    title: "Your BizKit — Skill Sprint",
    bullets: [
      "Curated tool guides for content, research and analysis",
      "Copy-paste workflows you can put to work today",
      "Weekly Bizkit Insights so you stay ahead of the curve",
    ],
  },
};

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flex: "0 0 auto", marginTop: 1 }} aria-hidden="true">
    <path d="M4 13l5 5L20 5" stroke="#ff4232" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function PersonaQuizRD() {
  const [picked, setPicked] = useState<PersonaId | null>(null);
  const rec = picked ? REC[picked] : null;

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <span className="rd-eyebrow" style={{ color: "var(--yellow)" }}>30-second start</span>
        <h2 style={{ color: "#fff", fontSize: "clamp(28px,2vw+18px,44px)", marginTop: 10 }}>
          First — who are you building for?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.85)", marginTop: 12, fontSize: 17 }}>
          Pick one. We&rsquo;ll point you straight at the right kit.
        </p>
      </div>

      <div style={{ marginTop: 34, display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 18 }} className="rd-quiz-grid">
        {PERSONAS.map((p) => {
          const on = picked === p.id;
          return (
            <button
              key={p.id}
              type="button"
              className="rd-card-lift"
              onClick={() => setPicked(p.id)}
              aria-pressed={on}
              style={{
                textAlign: "left", cursor: "pointer", fontFamily: "inherit", padding: 22,
                border: "3px solid var(--ink)", borderRadius: 20, background: "var(--paper)",
                boxShadow: on ? "8px 8px 0 var(--coral)" : "6px 6px 0 var(--ink)",
                borderColor: on ? "var(--coral)" : "var(--ink)",
                transform: on ? "translate(-2px,-2px)" : undefined,
              }}
            >
              <span className="rd-tag" style={{ background: "var(--yellow)" }}>{p.tag}</span>
              <span style={{ display: "block", marginTop: 14, fontWeight: 800, fontSize: 20, color: "var(--ink)" }}>{p.label}</span>
            </button>
          );
        })}
      </div>

      {rec && (
        <div
          className="rd-chunk rd-rise"
          style={{
            marginTop: 24, padding: "30px 32px", background: "var(--paper)",
            display: "grid", gridTemplateColumns: "1fr auto", gap: 26, alignItems: "center",
          }}
        >
          <div>
            <span className="rd-eyebrow">{rec.title}</span>
            <ul style={{ marginTop: 14, display: "grid", gap: 10 }}>
              {rec.bullets.map((b) => (
                <li key={b} style={{ display: "flex", gap: 12, fontSize: 16, color: "var(--text)" }}>
                  <CheckIcon />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link href="/rd/growth-score" className="rd-btn coral">Build my BizKit →</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .rd-quiz-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
