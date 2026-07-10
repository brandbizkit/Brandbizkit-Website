import type { ChartSpec } from "@/lib/content";

/**
 * Server-rendered SVG charts for Bizkit Insights articles.
 *
 * Charts are defined as data in the article's frontmatter (`charts:`) and
 * placed in the body with `[chart:N]` markers. Rendering them as inline SVG
 * keeps them crawlable, fast, and on-brand — no client JS or chart library.
 * A visually-hidden data table accompanies each chart for accessibility.
 */

const PALETTE = ["#697bdc", "#ff4232", "#f3c82e", "#0e5c46", "#92a7db", "#ff5733"];

function niceMax(max: number): number {
  if (max <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(max));
  for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10]) {
    if (max <= m * pow) return m * pow;
  }
  return 10 * pow;
}

function fmt(v: number, unit?: string): string {
  const s = v % 1 === 0 ? v.toLocaleString("en-US") : v.toFixed(1);
  return unit ? `${s}${unit}` : s;
}

function DataTable({ chart }: { chart: ChartSpec }) {
  return (
    <table className="sr-only">
      <caption>{chart.title}</caption>
      <thead>
        <tr><th>Label</th><th>Value</th></tr>
      </thead>
      <tbody>
        {chart.data.map((d) => (
          <tr key={d.label}><td>{d.label}</td><td>{fmt(d.value, chart.unit)}</td></tr>
        ))}
      </tbody>
    </table>
  );
}

function BarChart({ chart }: { chart: ChartSpec }) {
  const max = niceMax(Math.max(...chart.data.map((d) => d.value)));
  const rowH = 44;
  const labelW = 190;
  const chartW = 640;
  const h = chart.data.length * rowH + 8;
  return (
    <svg viewBox={`0 0 ${chartW} ${h}`} role="img" aria-label={chart.title} className="w-full">
      {chart.data.map((d, i) => {
        const y = i * rowH + 8;
        const w = Math.max(4, (d.value / max) * (chartW - labelW - 86));
        return (
          <g key={d.label}>
            <text x={labelW - 10} y={y + 17} textAnchor="end" fontSize="13" fontWeight="500" fill="#1d1e20">
              {d.label.length > 26 ? d.label.slice(0, 25) + "…" : d.label}
            </text>
            <rect x={labelW} y={y} width={chartW - labelW - 86} height={26} rx={13} fill="#f4f4f6" />
            <rect x={labelW} y={y} width={w} height={26} rx={13} fill={PALETTE[i % PALETTE.length]} />
            <text x={labelW + w + 10} y={y + 17} fontSize="13" fontWeight="700" fill="#0d141a">
              {fmt(d.value, chart.unit)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChart({ chart }: { chart: ChartSpec }) {
  const w = 640;
  const h = 300;
  const pad = { t: 20, r: 24, b: 44, l: 56 };
  const max = niceMax(Math.max(...chart.data.map((d) => d.value)));
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const pts = chart.data.map((d, i) => ({
    x: pad.l + (chart.data.length === 1 ? iw / 2 : (i / (chart.data.length - 1)) * iw),
    y: pad.t + ih - (d.value / max) * ih,
    ...d,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x},${pad.t + ih} L${pts[0].x},${pad.t + ih} Z`;
  const gridLines = [0, 0.25, 0.5, 0.75, 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={chart.title} className="w-full">
      {gridLines.map((g) => {
        const y = pad.t + ih - g * ih;
        return (
          <g key={g}>
            <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="#0d141a" strokeOpacity="0.08" />
            <text x={pad.l - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#1d1e20" opacity="0.55">
              {fmt(max * g, chart.unit)}
            </text>
          </g>
        );
      })}
      <path d={area} fill="#697bdc" opacity="0.12" />
      <path d={line} fill="none" stroke="#697bdc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="5" fill="#fff" stroke="#ff4232" strokeWidth="3" />
          <text x={p.x} y={pad.t + ih + 20} textAnchor="middle" fontSize="12" fontWeight="500" fill="#1d1e20">
            {p.label}
          </text>
          <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0d141a">
            {fmt(p.value, chart.unit)}
          </text>
        </g>
      ))}
    </svg>
  );
}

function DonutChart({ chart }: { chart: ChartSpec }) {
  const total = chart.data.reduce((s, d) => s + d.value, 0);
  const cx = 130;
  const cy = 130;
  const r = 92;
  const stroke = 40;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <svg viewBox="0 0 260 260" role="img" aria-label={chart.title} className="w-56 shrink-0">
        {chart.data.map((d, i) => {
          const frac = d.value / total;
          const dash = frac * circ;
          const el = (
            <circle
              key={d.label}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
          offset += dash;
          return el;
        })}
        <text x={cx} y={cy + 6} textAnchor="middle" fontSize="22" fontWeight="800" fill="#0d141a">
          {fmt(total, chart.unit)}
        </text>
      </svg>
      <ul className="grid gap-2 text-sm">
        {chart.data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2.5">
            <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
            <span className="text-brand-text/85">{d.label}</span>
            <span className="ml-auto font-semibold text-brand-ink">
              {fmt(d.value, chart.unit)}{" "}
              <span className="font-normal text-brand-text/50">({Math.round((d.value / total) * 100)}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ArticleChart({ chart }: { chart: ChartSpec }) {
  return (
    <figure className="card my-8 p-6 md:p-8">
      <figcaption className="mb-5">
        <p className="font-display text-lg font-bold text-brand-ink">{chart.title}</p>
      </figcaption>
      {chart.type === "bar" && <BarChart chart={chart} />}
      {chart.type === "line" && <LineChart chart={chart} />}
      {chart.type === "donut" && <DonutChart chart={chart} />}
      <DataTable chart={chart} />
      {chart.source && (
        <p className="mt-4 text-xs text-brand-text/50">Source: {chart.source}</p>
      )}
    </figure>
  );
}
