"use client";

/**
 * The Business Growth Score — ScoreApp-style assessment funnel.
 *
 * Flow: intro → 14 questions (1 stage + 12 scored + 1 bottleneck) →
 * contact gate (lead saved to Supabase with the full score breakdown in the
 * message) → dashboard results (gauge, dimension bars, table, notes, and a
 * stage-matched kit recommendation).
 *
 * All copy/questions live in content/growth-score.json.
 */
import { useMemo, useState } from "react";
import Link from "next/link";

export type GrowthScoreConfig = {
  title: string;
  subtitle: string;
  durationNote: string;
  dimensions: {
    id: string;
    label: string;
    icon: string;
    blurb: string;
    notes: { low: string; mid: string; high: string };
    quickWin: { low: string; mid: string; high: string };
  }[];
  questions: {
    id: string;
    type?: "profile";
    dimension?: string;
    question: string;
    options: { text: string; points?: number; value?: string }[];
  }[];
  grades: { min: number; label: string; color: string; summary: string }[];
  kits: Record<string, { name: string; price: string; why: string }>;
};

type Band = "low" | "mid" | "high";

function bandOf(score: number): Band {
  return score < 40 ? "low" : score < 70 ? "mid" : "high";
}

const BAND_META: Record<Band, { label: string; color: string; chip: string }> = {
  low: { label: "Needs attention", color: "#ff4232", chip: "bg-brand-accent/10 text-brand-accent" },
  mid: { label: "Getting there", color: "#f3c82e", chip: "bg-brand-yellow/20 text-[#8a6d00]" },
  high: { label: "Strong", color: "#0e5c46", chip: "bg-emerald-50 text-emerald-700" },
};

function Gauge({ score, color, label }: { score: number; color: string; label: string }) {
  const r = 80;
  const circ = 2 * Math.PI * r;
  const arc = (score / 100) * circ * 0.75; // 270° gauge
  return (
    <svg viewBox="0 0 200 200" className="w-56" role="img" aria-label={`Overall score ${score} out of 100 — ${label}`}>
      <g transform="rotate(135 100 100)">
        <circle cx="100" cy="100" r={r} fill="none" stroke="#f4f4f6" strokeWidth="18" strokeDasharray={`${circ * 0.75} ${circ}`} strokeLinecap="round" />
        <circle cx="100" cy="100" r={r} fill="none" stroke={color} strokeWidth="18" strokeDasharray={`${arc} ${circ}`} strokeLinecap="round" />
      </g>
      <text x="100" y="98" textAnchor="middle" fontSize="44" fontWeight="800" fill="#0d141a" fontFamily="var(--font-poppins)">
        {score}
      </text>
      <text x="100" y="122" textAnchor="middle" fontSize="13" fill="#1d1e20" opacity="0.55">
        out of 100
      </text>
    </svg>
  );
}

export default function GrowthScore({ config }: { config: GrowthScoreConfig }) {
  const [screen, setScreen] = useState<"intro" | "quiz" | "gate" | "dashboard">("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [contact, setContact] = useState({ name: "", email: "", business: "" });
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "error">("idle");

  const questions = config.questions;
  const q = questions[index];

  const results = useMemo(() => {
    const dims = config.dimensions.map((d) => {
      const qs = questions.filter((x) => x.dimension === d.id);
      const pts = qs.reduce((s, x) => s + (Number(answers[x.id]) || 0), 0);
      const max = qs.length * 3;
      const score = max ? Math.round((pts / max) * 100) : 0;
      return { ...d, score, band: bandOf(score) };
    });
    const overall = Math.round(dims.reduce((s, d) => s + d.score, 0) / (dims.length || 1));
    const grade = [...config.grades].reverse().find((g) => overall >= g.min) ?? config.grades[0];
    const stage = String(answers.stage ?? "idea");
    const kit = config.kits[stage] ?? config.kits.idea;
    const weakest = [...dims].sort((a, b) => a.score - b.score)[0];
    const strongest = [...dims].sort((a, b) => b.score - a.score)[0];
    return { dims, overall, grade, stage, kit, weakest, strongest };
  }, [answers, config, questions]);

  function answer(value: number | string) {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (index < questions.length - 1) setIndex(index + 1);
    else setScreen("gate");
  }

  async function submitLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitState("sending");
    const { dims, overall, grade, stage } = results;
    const summary = [
      `Growth Score: ${overall}/100 (${grade.label})`,
      `Stage: ${stage}`,
      `Bottleneck: ${String(answers.bottleneck ?? "—")}`,
      dims.map((d) => `${d.label}: ${d.score}`).join(", "),
      contact.business ? `Business: ${contact.business}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: contact.name,
        email: contact.email,
        message: summary,
        source: "growth-score",
        pagePath: window.location.pathname,
      }),
    });
    if (res.ok) {
      setScreen("dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSubmitState("error");
    }
  }

  const inputCls =
    "w-full rounded-xl border border-brand-ink/12 bg-white px-5 py-3.5 text-brand-ink shadow-sm transition placeholder:text-brand-text/40 outline-none focus:border-brand-periwinkle focus:ring-2 focus:ring-brand-periwinkle/25";

  /* ---------------- intro ---------------- */
  if (screen === "intro") {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-[0_24px_60px_rgb(13_20_26/0.15)] md:p-12">
        <p className="section-eyebrow">Free assessment</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-brand-ink md:text-4xl">{config.title}</h2>
        <p className="mx-auto mt-4 max-w-lg leading-relaxed text-brand-text/75">{config.subtitle}</p>
        <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3 text-left text-sm">
          {config.dimensions.map((d) => (
            <div key={d.id} className="flex items-center gap-2 rounded-xl bg-brand-light px-4 py-3">
              <span aria-hidden>{d.icon}</span>
              <span className="font-medium text-brand-ink">{d.label}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setScreen("quiz")} className="btn btn-primary mt-8 px-10 text-lg">
          Get My Score
        </button>
        <p className="mt-4 text-sm text-brand-text/50">{config.durationNote}</p>
      </div>
    );
  }

  /* ---------------- quiz ---------------- */
  if (screen === "quiz") {
    const progress = Math.round((index / questions.length) * 100);
    return (
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-[0_24px_60px_rgb(13_20_26/0.15)] md:p-12">
        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-light">
            <div className="h-full rounded-full bg-brand-periwinkle transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <span className="shrink-0 text-sm font-semibold text-brand-text/60">
            {index + 1} / {questions.length}
          </span>
        </div>
        <h2 className="mt-8 font-display text-2xl font-bold leading-snug text-brand-ink">{q.question}</h2>
        <div className="mt-6 grid gap-3">
          {q.options.map((opt) => (
            <button
              key={opt.text}
              onClick={() => answer(q.type === "profile" ? opt.value! : opt.points!)}
              className="rounded-xl border border-brand-ink/12 bg-white px-5 py-4 text-left text-brand-text/90 transition hover:-translate-y-0.5 hover:border-brand-periwinkle hover:bg-brand-periwinkle/5 hover:shadow-md"
            >
              {opt.text}
            </button>
          ))}
        </div>
        {index > 0 && (
          <button onClick={() => setIndex(index - 1)} className="mt-6 text-sm font-medium text-brand-text/50 hover:text-brand-ink">
            ← Back
          </button>
        )}
      </div>
    );
  }

  /* ---------------- contact gate ---------------- */
  if (screen === "gate") {
    return (
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-[0_24px_60px_rgb(13_20_26/0.15)] md:p-12">
        <p aria-hidden className="text-4xl">📊</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-brand-ink">Your score is ready!</h2>
        <p className="mx-auto mt-3 max-w-md text-brand-text/75">
          Tell us where to send it and your personalized dashboard opens instantly — plus,
          brandbizkit will review your results and get back to you with a tailored offer.
        </p>
        <form onSubmit={submitLead} className="mt-7 grid gap-3 text-left">
          <label className="sr-only" htmlFor="gs-name">Name</label>
          <input id="gs-name" required placeholder="Your name*" className={inputCls}
            value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
          <label className="sr-only" htmlFor="gs-email">Email</label>
          <input id="gs-email" type="email" required placeholder="Your email*" className={inputCls}
            value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
          <label className="sr-only" htmlFor="gs-business">Business name</label>
          <input id="gs-business" placeholder="Business name (optional)" className={inputCls}
            value={contact.business} onChange={(e) => setContact({ ...contact, business: e.target.value })} />
          <button type="submit" disabled={submitState === "sending"} className="btn btn-primary mt-2 w-full text-lg">
            {submitState === "sending" ? "Preparing your dashboard…" : "Show My Score & Dashboard →"}
          </button>
          {submitState === "error" && (
            <p className="text-center text-sm text-brand-accent">Something went wrong — please try again.</p>
          )}
          <p className="text-center text-xs leading-relaxed text-brand-text/50">
            By getting your score you agree that brandbizkit may contact you about your results.{" "}
            <Link href="/privacy-policy" className="underline">Privacy Policy</Link>
          </p>
        </form>
      </div>
    );
  }

  /* ---------------- dashboard ---------------- */
  const { dims, overall, grade, kit, weakest, strongest } = results;
  return (
    <div className="mx-auto max-w-4xl">
      {/* confirmation notice */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-800">
        ✅ Results saved — <strong>brandbizkit will get back to you at {contact.email}</strong> with a
        personalized offer. Meanwhile, here's your full breakdown.
      </div>

      {/* overall score */}
      <section className="card mt-6 p-8 md:p-10">
        <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
          <div className="mx-auto">
            <Gauge score={overall} color={grade.color} label={grade.label} />
          </div>
          <div>
            <p className="section-eyebrow">Your Business Growth Score</p>
            <h2 className="mt-1 font-display text-3xl font-bold" style={{ color: grade.color }}>
              {grade.label}
            </h2>
            <p className="mt-3 leading-relaxed text-brand-text/80">{grade.summary}</p>
          </div>
        </div>
      </section>

      {/* dimension bars */}
      <section className="card mt-6 p-8 md:p-10">
        <h3 className="font-display text-xl font-bold text-brand-ink">Where you stand, area by area</h3>
        <p className="mt-1 text-sm text-brand-text/60">The dotted line at 80 marks a healthy target for a growing business.</p>
        <div className="mt-6 grid gap-5">
          {dims.map((d) => (
            <div key={d.id}>
              <div className="mb-1.5 flex items-baseline justify-between text-sm">
                <span className="font-semibold text-brand-ink">{d.icon} {d.label}</span>
                <span className="font-bold" style={{ color: BAND_META[d.band].color }}>{d.score}</span>
              </div>
              <div className="relative h-4 overflow-hidden rounded-full bg-brand-light">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.score}%`, background: BAND_META[d.band].color }} />
                <div aria-hidden className="absolute inset-y-0 left-[80%] w-0.5 border-l-2 border-dashed border-brand-ink/30" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* table: score + quick win */}
      <section className="card mt-6 overflow-hidden">
        <div className="p-8 pb-4 md:px-10">
          <h3 className="font-display text-xl font-bold text-brand-ink">Your quick wins</h3>
          <p className="mt-1 text-sm text-brand-text/60">One concrete thing you can do in each area — most cost nothing but an afternoon.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-light text-left text-brand-text/60">
              <tr>
                <th className="px-8 py-3 md:px-10">Area</th>
                <th className="px-3 py-3">Score</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-8 py-3 md:px-10">Do this first</th>
              </tr>
            </thead>
            <tbody>
              {dims.map((d) => (
                <tr key={d.id} className="border-t border-brand-ink/8 align-top">
                  <td className="whitespace-nowrap px-8 py-4 font-semibold text-brand-ink md:px-10">{d.icon} {d.label}</td>
                  <td className="px-3 py-4 font-bold" style={{ color: BAND_META[d.band].color }}>{d.score}</td>
                  <td className="px-3 py-4">
                    <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${BAND_META[d.band].chip}`}>
                      {BAND_META[d.band].label}
                    </span>
                  </td>
                  <td className="px-8 py-4 leading-relaxed text-brand-text/80 md:px-10">{d.quickWin[d.band]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* notes per dimension */}
      <section className="mt-6 grid gap-5 md:grid-cols-2">
        {dims.map((d) => (
          <article key={d.id} className={`card p-6 ${d.id === weakest.id ? "border-2 border-brand-accent/40" : ""}`}>
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-display font-bold text-brand-ink">{d.icon} {d.label}</h4>
              {d.id === weakest.id && (
                <span className="rounded-full bg-brand-accent/10 px-2.5 py-1 text-xs font-bold text-brand-accent">Fix first</span>
              )}
              {d.id === strongest.id && d.id !== weakest.id && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Your strength</span>
              )}
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-brand-text/80">{d.notes[d.band]}</p>
          </article>
        ))}
      </section>

      {/* recommendation + CTA */}
      <section className="card mt-6 border-2 border-brand-periwinkle/30 bg-gradient-to-br from-white to-brand-periwinkle/5 p-8 md:p-10">
        <p className="section-eyebrow">Our recommendation for you</p>
        <h3 className="mt-2 font-display text-2xl font-bold text-brand-ink">
          {kit.name} <span className="text-lg font-semibold text-brand-text/55">— {kit.price}</span>
        </h3>
        <p className="mt-3 max-w-2xl leading-relaxed text-brand-text/80">{kit.why}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/#services" className="btn btn-primary">See the {kit.name} →</Link>
          <Link href="/#lets-talk" className="btn btn-outline">Talk to us first</Link>
        </div>
      </section>

      <p className="mt-8 text-center">
        <button
          onClick={() => { setAnswers({}); setIndex(0); setScreen("intro"); setSubmitState("idle"); }}
          className="text-sm font-medium text-brand-text/50 underline underline-offset-4 hover:text-brand-ink"
        >
          Retake the assessment
        </button>
      </p>
    </div>
  );
}
