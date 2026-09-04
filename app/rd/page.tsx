import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/lib/content";
import PersonaQuizRD from "./_components/PersonaQuizRD";
import ToolExplorerRD, { type RdTool } from "./_components/ToolExplorerRD";
import { Character, CastLineup, CharacterBust, type CastId } from "./_components/Cast";

const TEN_X = [
  "You stop wasting time on busywork",
  "You become the strategist, not just the doer",
  "You launch campaigns in days, not weeks",
  "You compete with big teams — without hiring one",
];

const EXPLORE_TOOLS: RdTool[] = [
  { name: "Looka", cat: "Branding", note: "Logo + brand-kit generator", free: "Free: preview + low-res logo" },
  { name: "Canva", cat: "Branding", note: "Brand kits, posts, decks", free: "Free plan: generous" },
  { name: "ChatGPT", cat: "Content", note: "Drafts, research, ideation", free: "Free: GPT-4o mini + limited 4o" },
  { name: "Perplexity", cat: "Content", note: "Cited answers for research", free: "Free: standard search" },
  { name: "Notion AI", cat: "Content", note: "Notes → SOPs, briefs, plans", free: "Free trial credits" },
  { name: "Zapier", cat: "Automation", note: "Connect your tools, no code", free: "Free: 100 tasks/mo" },
  { name: "Make", cat: "Automation", note: "Visual multi-step automations", free: "Free: 1,000 ops/mo" },
  { name: "Chatbase", cat: "Chatbots", note: "Site chatbot from your docs", free: "Free: 1 bot, limited msgs" },
  { name: "Voiceflow", cat: "Chatbots", note: "Design assistant flows", free: "Free: 2 assistants" },
  { name: "PostHog", cat: "Analytics", note: "Product analytics + funnels", free: "Free: 1M events/mo" },
];

const SERVICES = [
  { n: "01", bar: "var(--coral)", name: "Biz in a Box", sub: "(Solution Design)", tint: "var(--coral)",
    body: "Plug-and-play starter kits. DIY templates, guides & automated workflows — or DFY, we set the whole system up for you." },
  { n: "02", bar: "var(--peri)", name: "AI Tools Education", sub: "(AI School)", tint: "var(--peri)",
    body: "Workshops & masterclasses on AI for branding, content, workflows and ops — plus hands-on tool setup and integration." },
  { n: "03", bar: "var(--yellow)", name: "AI Transformation", sub: "(Consulting)", tint: "var(--green)",
    body: "End-to-end adoption strategy: business impact + AI readiness assessment, then redesigning processes around AI." },
];

export default function RdHome() {
  const posts = getPosts().slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section style={{ position: "relative", padding: "48px 0 88px" }}>
        <div aria-hidden className="rd-dots" style={{ position: "absolute", inset: 0, opacity: 0.12 }} />
        <div aria-hidden style={{ position: "absolute", top: -60, left: -80, width: 320, height: 320, background: "var(--peri)", borderRadius: "50%", opacity: 0.18 }} />
        <div aria-hidden style={{ position: "absolute", top: 120, right: -120, width: 360, height: 360, background: "var(--coral)", borderRadius: "50%", opacity: 0.12 }} />

        <div className="rd-wrap" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 44, alignItems: "center" }}>
          <div>
            <span className="rd-sticker rd-rise" style={{ transform: "rotate(-2deg)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#0d141a" strokeWidth="3" /><path d="M8 12.5l2.8 2.8L16 9.5" stroke="#0d141a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              100% free · zero code
            </span>
            <h1 className="rd-rise" style={{ marginTop: 22, fontSize: "clamp(40px, 4.4vw + 12px, 76px)" }}>
              <span className="rd-coral">FREE</span> AI tools, templates<br />&amp; guides in <span className="rd-mark">ONE BIZKIT</span>
            </h1>
            <p className="rd-lead rd-rise" style={{ marginTop: 22, maxWidth: "33rem" }}>
              Whether you&rsquo;re launching a brand, already running a business, or just want to use AI
              better at your job — brandbizkit hands you curated free AI tools and real workflows.
              Zero overwhelm, step-by-step.
            </p>
            <div className="rd-rise" style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <Link href="/rd/growth-score" className="rd-btn">
                Get My Free Growth Score
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" stroke="#0d141a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              <Link href="/rd/tools" className="rd-btn ghost">or browse the tools first</Link>
            </div>
            <div className="rd-rise" style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <span className="rd-sticker" style={{ background: "var(--cream)", transform: "rotate(-1.5deg)" }}>74 free tools</span>
              <span className="rd-sticker" style={{ background: "var(--cream)", transform: "rotate(1.5deg)" }}>33 step-by-step guides</span>
              <span className="rd-sticker" style={{ background: "var(--cream)", transform: "rotate(-1deg)" }}>0 lines of code</span>
            </div>
          </div>

          {/* hero scene — the cast, mid-work, so it never reads as pure automation */}
          <div className="rd-rise" style={{ position: "relative", minHeight: 470 }}>
            <div className="rd-chunk" style={{ position: "absolute", top: 96, right: 0, width: 210, padding: 16, transform: "rotate(4deg)", background: "var(--peri)", color: "#fff" }}>
              <strong style={{ fontSize: 14 }}>Automation stack</strong>
              <p style={{ marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.88)" }}>CRM, funnels &amp; chatbots — wired together for you.</p>
            </div>
            <Character id="operator" pose="type" size={250} style={{ position: "absolute", left: 40, top: 40 }} />
            <Character id="launcher" pose="celebrate" size={150} style={{ position: "absolute", left: -6, bottom: -6 }} />
            <Character id="upskiller" pose="read" size={140} style={{ position: "absolute", right: 6, bottom: 4 }} />
            <svg aria-hidden style={{ position: "absolute", top: -6, right: 46 }} width="66" height="66" viewBox="0 0 24 24" fill="none"><path d="M12 1v22M1 12h22M4 4l16 16M20 4L4 20" stroke="#ff4232" strokeWidth="2.4" strokeLinecap="round" /></svg>
          </div>
        </div>
      </section>

      <div className="rd-mq"><div className="rd-mq-track">
        {["ChatGPT", "Canva", "Notion AI", "Perplexity", "ElevenLabs", "Zapier", "Midjourney", "Gamma",
          "ChatGPT", "Canva", "Notion AI", "Perplexity", "ElevenLabs", "Zapier", "Midjourney", "Gamma"].map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div></div>

      {/* PERSONA QUIZ */}
      <section style={{ position: "relative", background: "var(--peri)", padding: "72px 0" }}>
        <div aria-hidden className="rd-dots" style={{ position: "absolute", inset: 0, opacity: 0.1 }} />
        <div className="rd-wrap" style={{ position: "relative" }}>
          <CastLineup poses={{ launcher: "wave", operator: "present", upskiller: "point" }} size={150} className="rd-rise" />
          <div style={{ marginTop: 8 }}>
            <PersonaQuizRD />
          </div>
        </div>
      </section>

      {/* TOOL EXPLORER */}
      <section className="rd-section">
        <div className="rd-wrap">
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 30, flexWrap: "wrap" }}>
            <div>
              <span className="rd-eyebrow">The directory</span>
              <h2 className="rd-h2" style={{ marginTop: 8 }}>Point-and-click<br />your AI stack</h2>
            </div>
            <p className="rd-lead" style={{ maxWidth: "30rem" }}>
              Every tool listed with its real free-tier limits and a plain-English &ldquo;what it&rsquo;s for&rdquo;. Filter, don&rsquo;t scroll.
            </p>
          </div>
          <div style={{ marginTop: 28 }}>
            <ToolExplorerRD tools={EXPLORE_TOOLS} />
          </div>
        </div>
      </section>

      {/* WHY 10X */}
      <section style={{ background: "var(--cream)", borderTop: "3px solid var(--ink)", borderBottom: "3px solid var(--ink)", padding: "80px 0" }}>
        <div className="rd-wrap rd-grid-2" style={{ alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <div className="rd-chunk" style={{ padding: 0, overflow: "hidden", transform: "rotate(-2deg)", background: "var(--ink)", aspectRatio: "16/10", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ width: 78, height: 78, borderRadius: 999, background: "var(--yellow)", border: "3px solid var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 5l12 7-12 7V5z" fill="#0d141a" /></svg>
              </span>
            </div>
            <span className="rd-sticker" style={{ position: "absolute", bottom: -18, left: 24, transform: "rotate(3deg)", background: "var(--coral)", color: "#fff" }}>2 min watch</span>
            <Character id="upskiller" pose="present" size={168} style={{ position: "absolute", right: -70, bottom: -20 }} className="rd-hide-sm" />
          </div>
          <div>
            <span className="rd-eyebrow">Work smarter</span>
            <h2 className="rd-h2" style={{ marginTop: 8 }}>
              Why this 10x&rsquo;s your brand <span className="rd-coral">(without burning out)</span>
            </h2>
            <p className="rd-lead" style={{ marginTop: 16 }}>
              Starting used to mean months of designing, writing and guessing. Now you launch fast —
              <strong> if you know which AI tools to reach for.</strong>
            </p>
            <ul style={{ marginTop: 22, display: "grid", gap: 12 }}>
              {TEN_X.map((t) => (
                <li key={t} style={{ display: "flex", gap: 12, fontSize: 16, fontWeight: 600 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 13l5 5L20 5" stroke="#697bdc" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {t}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 26, display: "inline-block", padding: "22px 26px", border: "3px solid var(--ink)", borderRadius: 20, background: "linear-gradient(135deg,#ff4b2b,#ff416c)", color: "#fff", boxShadow: "8px 8px 0 var(--ink)", transform: "rotate(-1.5deg)", maxWidth: "30rem" }}>
              <strong style={{ fontSize: 17 }}>Big idea</strong>
              <p style={{ marginTop: 6, fontSize: 15, color: "rgba(255,255,255,0.95)" }}>
                brandbizkit isn&rsquo;t just a toolkit. It&rsquo;s a new way of working — faster, smarter, way more fun.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDERS — real photo */}
      <section className="rd-section">
        <div className="rd-wrap rd-grid-2" style={{ alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <div className="rd-chunk" style={{ padding: 0, overflow: "hidden", transform: "rotate(2deg)" }}>
              <Image
                src="/assets/karla-and-michael-AVLxNDqJ1OU449D2.png"
                alt="Karla and Michael, the founders of BrandBizkit"
                width={640}
                height={480}
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </div>
            <span style={{ position: "absolute", top: -14, left: "38%", width: 90, height: 26, background: "rgba(243,200,46,0.85)", border: "2px solid var(--ink)", transform: "rotate(-8deg)" }} />
            <span className="rd-sticker" style={{ position: "absolute", bottom: -16, right: 20, transform: "rotate(4deg)" }}>👋 Karla &amp; Michael</span>
            <Character id="launcher" pose="wave" size={130} style={{ position: "absolute", left: -78, bottom: -10 }} className="rd-hide-sm" />
          </div>
          <div>
            <span className="rd-eyebrow">Meet your guides</span>
            <h2 className="rd-h2" style={{ marginTop: 8 }}>
              Just starting out? <span className="rd-coral">We&rsquo;ll help you make sense of it.</span>
            </h2>
            <p className="rd-lead" style={{ marginTop: 16 }}>
              Not every founder starts with a plan — some start with a feeling. That you want to launch
              something. Build a brand that reflects who you are. Bring your idea to life without spending
              months figuring it out.
            </p>
            <p style={{ marginTop: 14, fontSize: 16, color: "rgba(29,30,32,0.8)" }}>
              That&rsquo;s exactly why we built <strong>brandbizkit</strong> — real people, not just software.
              Starting a business can feel overwhelming, so we simplified it.
            </p>
            <Link href="/rd/services" className="rd-btn peri" style={{ marginTop: 26 }}>See the services ↓</Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ background: "var(--ink)", padding: "88px 0", scrollMarginTop: 80 }}>
        <div className="rd-wrap">
          <div style={{ textAlign: "center" }}>
            <span className="rd-eyebrow" style={{ color: "var(--yellow)" }}>Our services</span>
            <h2 style={{ color: "#fff", fontSize: "clamp(32px,3vw+14px,54px)", marginTop: 8 }}>Choose your goal</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 12, fontSize: 17 }}>
              Launch effortlessly with free-tool kit recommendations and step-by-step guidance.
            </p>
          </div>
          <div className="rd-grid-3" style={{ marginTop: 42 }}>
            {SERVICES.map((s) => (
              <div key={s.n} className="rd-chunk rd-card-lift" style={{ padding: 0, overflow: "hidden", background: "var(--paper)" }}>
                <div style={{ height: 12, background: s.bar, borderBottom: "3px solid var(--ink)" }} />
                <div style={{ padding: 26 }}>
                  <span style={{ fontWeight: 800, fontSize: 40, color: "rgba(13,20,26,0.14)" }}>{s.n}</span>
                  <h3 style={{ fontSize: 22, marginTop: 4 }}>
                    {s.name} <span style={{ color: s.tint }}>{s.sub}</span>
                  </h3>
                  <p style={{ marginTop: 10, fontSize: 14, color: "rgba(29,30,32,0.75)" }}>{s.body}</p>
                  <Link href="/rd/services" style={{ display: "inline-block", marginTop: 16, fontWeight: 800, color: "var(--peri)" }}>Learn more →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — with photo slots for real people */}
      <section className="rd-section">
        <div className="rd-wrap">
          <div style={{ textAlign: "center" }}>
            <span className="rd-eyebrow">Real founders</span>
            <h2 className="rd-h2" style={{ marginTop: 8 }}>People who launched with a BizKit</h2>
          </div>
          <div className="rd-grid-3" style={{ marginTop: 36 }}>
            {([
              { q: "The step-by-step guidance and free tools made the whole process smooth — and actually enjoyable.", name: "Alex Smith", role: "Founder, retail brand", cast: "launcher" as CastId },
              { q: "Went from spreadsheet chaos to an automated CRM in a weekend, without hiring anyone.", name: "Priya N.", role: "Owner, services business", cast: "operator" as CastId },
              { q: "I finally use AI properly at work instead of pretending I do in meetings.", name: "[YOUR CUSTOMER]", role: "[ROLE / BUSINESS]", cast: "upskiller" as CastId },
            ]).map((t, i) => (
              <figure key={i} className="rd-chunk rd-card-lift" style={{ padding: 22, margin: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {i === 2 ? (
                    <div className="rd-photoslot" style={{ width: 52, height: 52, minHeight: 52, borderRadius: 999, padding: 0, fontSize: 10 }}>
                      <span>📷</span>
                    </div>
                  ) : (
                    <CharacterBust id={t.cast} size={52} />
                  )}
                  <div aria-hidden style={{ display: "flex", gap: 2 }}>
                    {Array.from({ length: 5 }).map((_, k) => (
                      <svg key={k} width="16" height="16" viewBox="0 0 24 24" fill="#f3c82e"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.9 5.9 21.4l1.4-6.8L2.2 9.9l6.9-.8L12 2z" /></svg>
                    ))}
                  </div>
                </div>
                <blockquote style={{ margin: "14px 0 0", fontSize: 15, fontWeight: 600, color: "var(--text)", lineHeight: 1.5 }}>
                  &ldquo;{t.q}&rdquo;
                </blockquote>
                <figcaption style={{ marginTop: 12, fontSize: 13, color: "rgba(29,30,32,0.6)" }}>
                  <strong style={{ color: "var(--ink)" }}>{t.name}</strong> · {t.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      <section style={{ background: "var(--cream)", borderTop: "3px solid var(--ink)", padding: "80px 0" }}>
        <div className="rd-wrap">
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between" }}>
            <div>
              <span className="rd-eyebrow">From the blog</span>
              <h2 className="rd-h2" style={{ marginTop: 8 }}>Latest Bizkit Insights</h2>
            </div>
            <Link href="/rd/insights" style={{ fontWeight: 800, color: "var(--peri)" }}>View all insights →</Link>
          </div>
          <div className="rd-grid-3" style={{ marginTop: 34 }}>
            {posts.map((p, i) => (
              <Link key={p.slug} href={`/rd/insights/${p.slug}`} className="rd-chunk rd-card-lift" style={{ padding: 0, overflow: "hidden", background: "#fff", display: "block", color: "inherit" }}>
                <div style={{ height: 150, background: [ "var(--peri)", "var(--coral)", "var(--yellow)" ][i % 3], borderBottom: "3px solid var(--ink)", position: "relative" }}>
                  <span className="rd-tag" style={{ position: "absolute", left: 14, bottom: -12, background: "#fff" }}>Insight</span>
                </div>
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 17, lineHeight: 1.3 }}>{p.title}</h3>
                  <p style={{ marginTop: 8, fontSize: 13, color: "rgba(29,30,32,0.6)" }}>{p.author} · {p.date}{p.readTime ? ` · ${p.readTime}` : ""}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
