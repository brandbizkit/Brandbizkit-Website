"use client";

import { useMemo, useState } from "react";

export type RdTool = { name: string; cat: string; note: string; free: string; url?: string };

export default function ToolExplorerRD({ tools }: { tools: RdTool[] }) {
  const cats = useMemo(() => {
    const set = Array.from(new Set(tools.map((t) => t.cat)));
    return ["All", ...set];
  }, [tools]);
  const [cat, setCat] = useState("All");
  const shown = cat === "All" ? tools : tools.filter((t) => t.cat === cat);

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {cats.map((c) => (
          <button key={c} type="button" className="rd-pill" data-on={cat === c} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 18 }} className="rd-tool-grid">
        {shown.map((t) => {
          const inner = (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <strong style={{ fontSize: 17, color: "var(--ink)" }}>{t.name}</strong>
                <span className="rd-tag">{t.cat}</span>
              </div>
              <p style={{ marginTop: 10, fontSize: 14, color: "rgba(29,30,32,0.72)" }}>{t.note}</p>
              <div style={{ marginTop: 14, fontWeight: 800, fontSize: 13, color: "var(--green)" }}>{t.free}</div>
            </>
          );
          const boxStyle: React.CSSProperties = {
            border: "3px solid var(--ink)", borderRadius: 16, background: "#fff",
            padding: 18, boxShadow: "5px 5px 0 var(--ink)", display: "block", color: "inherit",
          };
          return t.url ? (
            <a key={t.name} href={t.url} target="_blank" rel="noopener" className="rd-card-lift" style={boxStyle}>
              {inner}
            </a>
          ) : (
            <div key={t.name} className="rd-card-lift" style={boxStyle}>
              {inner}
            </div>
          );
        })}
      </div>

      {shown.length === 0 && (
        <p style={{ marginTop: 20, fontWeight: 700, color: "rgba(29,30,32,0.6)" }}>Nothing in that category yet.</p>
      )}

      <style>{`
        @media (max-width: 900px) { .rd-tool-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 900px) and (max-width: 1100px) { .rd-tool-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; } }
      `}</style>
    </div>
  );
}
