"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { label: "AI School", href: "/rd/ai-school" },
  { label: "Services", href: "/rd/services" },
  { label: "Free AI Tools", href: "/rd/tools" },
  { label: "Insights", href: "/rd/insights" },
  { label: "Connect", href: "/rd/connect" },
];

function Logo() {
  return (
    <Link href="/rd" aria-label="BrandBizkit home" style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span
        style={{
          display: "inline-flex", width: 34, height: 34, alignItems: "center", justifyContent: "center",
          background: "var(--coral)", border: "3px solid var(--ink)", borderRadius: 10, transform: "rotate(-6deg)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.9 5.9 21.4l1.4-6.8L2.2 9.9l6.9-.8L12 2z" fill="#fff" />
        </svg>
      </span>
      <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.03em", color: "var(--ink)" }}>brandbizkit</span>
    </Link>
  );
}

export default function RdNav() {
  const [open, setOpen] = useState(false);
  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,253,251,0.9)", backdropFilter: "blur(8px)",
        borderBottom: "3px solid var(--ink)",
      }}
    >
      <div className="rd-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 40px" }}>
        <Logo />
        <nav aria-label="Redesign navigation" className="rd-nav-desktop" style={{ alignItems: "center", gap: 26 }}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={{ color: "var(--ink)", fontWeight: 700, fontSize: 15 }}>
              {l.label}
            </Link>
          ))}
          <Link href="/rd/growth-score" className="rd-btn coral" style={{ fontSize: 15, padding: "11px 18px", boxShadow: "4px 4px 0 var(--ink)" }}>
            Get My Growth Score
          </Link>
        </nav>
        <button
          className="rd-nav-toggle"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          style={{ border: "3px solid var(--ink)", borderRadius: 10, background: "#fff", padding: 6, cursor: "pointer" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="#0d141a" strokeWidth="3" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" stroke="#0d141a" strokeWidth="3" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="rd-wrap" style={{ padding: "8px 20px 20px", display: "grid", gap: 4 }}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ color: "var(--ink)", fontWeight: 800, padding: "10px 0", fontSize: 17 }}>
              {l.label}
            </Link>
          ))}
          <Link href="/rd/growth-score" onClick={() => setOpen(false)} className="rd-btn coral" style={{ marginTop: 8 }}>
            Get My Growth Score
          </Link>
        </div>
      )}

      <style>{`
        .rd-nav-desktop { display: none; }
        .rd-nav-toggle { display: inline-flex; }
        @media (min-width: 940px) {
          .rd-nav-desktop { display: flex; }
          .rd-nav-toggle { display: none; }
        }
      `}</style>
    </header>
  );
}
