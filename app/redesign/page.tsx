/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { getSite, getPosts, getTools, getVideosForPage } from "@/lib/content";
import { canonicalToolsSlug } from "@/lib/tools-directory";
import PodcastWidget from "@/components/PodcastWidget";
import PersonaQuiz from "@/components/PersonaQuiz";
import VideoWithTranscript from "@/components/VideoWithTranscript";
import ServicesTail from "@/components/ServicesTail";
import RedesignNav from "./RedesignNav";
import RedesignFooter from "./RedesignFooter";
import Reveal from "./Reveal";

export const metadata: Metadata = {
  title: "BrandBizkit — Redesign Preview",
  robots: { index: false, follow: false },
};

/* Copy carried over verbatim from app/page.tsx */
const TEN_X = [
  "You stop wasting time on busywork",
  "You become the strategist, not just the doer",
  "You launch campaigns in days, not weeks",
  "You compete with big teams — without hiring one",
  "You build personalized automations with zero coding",
];

const SERVICES = [
  {
    n: "1",
    name: "Biz in a Box",
    sub: "(Solution Design)",
    blurb: "Practical, plug-and-play business starter kits:",
    items: [
      "DIY (Do It Yourself): Templates, guides, toolkits, and automated workflows entrepreneurs can implement on their own.",
      "DFY (Done For You): Full setup service where BrandBizkit designs and implements the system for the client.",
    ],
    href: "#biz-in-a-box",
    image: "/assets/brandbizkit_biz-in-a-box2-mePJRokbwDHjM92w.png",
  },
  {
    n: "2",
    name: "AI Tools Education",
    sub: "(AI School)",
    blurb: "Helping businesses use AI in their day-to-day:",
    items: [
      "Training / Masterclasses: Workshops, webinars, and private sessions teaching AI tools for branding, content, workflows, and business operations.",
      "Affiliate Tool Operations: Technical setup + integration of AI and no-code tools (automation, CRM, funnels, chatbots, analytics).",
    ],
    href: "/ai-school",
    image: "/assets/bb_laptop-YbNJEPyLNyhr9yo9.png",
  },
  {
    n: "3",
    name: "AI Transformation",
    sub: "(Consulting)",
    blurb: "End2end AI adoption strategy for organizations:",
    items: [
      "Problem Diagnosis (Business Assessment): Business Impact Assessment + AI Readiness Scan to identify gaps, inefficiencies, and opportunities.",
      "Strategic AI Transformation: Redesigning processes, operating models, and customer experiences using AI to drive growth, cost-savings, and innovation.",
    ],
    href: "#lets-talk",
    image: "/assets/bb_computer-YNq2RaNbjzs6nnOv.png",
  },
];

const CATEGORIES = [
  { base: "top-free-ai-tools", label: "Top AI tools", image: "/assets/top-ai-tools_brandbizkit-AoP4labKrJtGWMb8.png" },
  { base: "top-free-ai-image-tools", label: "Image tools", image: "/assets/top-ai-image-tools_brandbizkit-AQEe16WoOvHLKjbj.png" },
  { base: "top-free-ai-video-tools", label: "Video tools", image: "/assets/top-ai-video-tools_brandbizkit-YbN4G6g0rxH6yKqN.png" },
  { base: "top-free-ai-no-code-tools", label: "Web app tools", image: "/assets/top-ai-web-app-tools_brandbizkit-mjE4yjbKeMty37gw.png" },
];

const anchor = { scrollMarginTop: "5.5rem" } as const;

export default function RedesignHomePage() {
  const site = getSite();
  const posts = getPosts().slice(0, 3);
  const tools = getTools();
  const videos = getVideosForPage("/");

  return (
    <>
      <RedesignNav site={site} />
      <PodcastWidget />

      <div data-od-id="redesign-home">
        {/* 1 — Hero */}
        <section className="rd-hero" data-od-id="hero">
          <div className="rd-wrap rd-hero__grid">
            <Reveal>
              <h1 className="rd-hero__title">
                FREE AI Tools, Templates, &amp; Guides in ONE BIZKIT
              </h1>
              <p className="rd-hero__lede">
                Whether you&apos;re launching a brand, already running a business, or want to use AI
                better at your job — brandbizkit gives you curated, free AI tools and real workflows,
                with zero coding, zero overwhelm, and step-by-step guidance.
              </p>
              <div className="rd-hero__actions">
                <a href="/growth-score" className="rd-btn rd-btn--score" data-od-id="hero-cta">
                  Get My Free Growth Score →
                </a>
                <a href="#popularaitools" className="rd-link">
                  or browse the free AI tools first
                </a>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="rd-hero__panel">
                <span className="rd-hero__dot rd-hero__dot--a" aria-hidden="true" />
                <span className="rd-hero__dot rd-hero__dot--b" aria-hidden="true" />
                <img
                  src="/assets/brandbizkit-hero-background3-A0xjDaGWoRIpJQ9B.png"
                  alt=""
                  width={1120}
                  height={1400}
                  loading="eager"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* 2 — Persona quiz */}
        <section id="persona-quiz" className="rd-section rd-section--light" style={anchor} data-od-id="persona-quiz">
          <div className="rd-wrap" style={{ maxWidth: "62rem" }}>
            <PersonaQuiz />
          </div>
        </section>

        {/* 3 — Top FREE AI Tools banner + category tiles */}
        <section className="rd-section rd-section--tight" data-od-id="tool-categories">
          <div className="rd-wrap">
            <a href={`/${canonicalToolsSlug("top-free-ai-tools")}`} className="rd-banner">
              🚀 Top FREE AI Tools
            </a>
            <Reveal className="rd-grid rd-grid--4">
              {CATEGORIES.map((c) => (
                <a
                  key={c.base}
                  href={`/${canonicalToolsSlug(c.base)}`}
                  className="rd-cat"
                  style={{ marginTop: "2rem" }}
                >
                  <img src={c.image} alt={`${c.label} — free AI tools`} width={349} height={233} loading="lazy" />
                </a>
              ))}
            </Reveal>
          </div>
        </section>

        {/* 4 — Why learning this will 10x your brand */}
        <section className="rd-section" data-od-id="why-10x">
          <div className="rd-wrap">
            <Reveal className="rd-head--center">
              <span className="rd-eyebrow">Work smarter</span>
              <h2 className="rd-h2">
                🚀 Why Learning This Will 10x Your Brand{" "}
                <span className="rd-mark">(Without Burning Out)</span>
              </h2>
              <p className="rd-lede">
                Let&apos;s be real. Starting a brand or business used to mean spending months
                designing, writing, planning, and guessing. Now? You can launch faster than ever —{" "}
                <strong>if you know how to use the right AI tools</strong>.
              </p>
            </Reveal>

            <div className="rd-split" style={{ marginTop: "3rem", alignItems: "start" }}>
              <div style={{ display: "grid", gap: "1.5rem" }}>
                {videos.map((v) => (
                  <VideoWithTranscript key={v.id} video={v} />
                ))}
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem" }}>Here&apos;s why that matters:</h3>
                <ul className="rd-tick-list">
                  {TEN_X.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className="rd-idea">
                  <h4>Big Idea</h4>
                  <p>
                    brandbizkit isn&apos;t just a toolkit. It&apos;s your new way of working —
                    faster, smarter, and way more fun.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5 — Just starting out */}
        <section className="rd-section rd-section--light" data-od-id="just-starting-out">
          <div className="rd-wrap rd-split">
            <Reveal>
              <span className="rd-eyebrow">Meet your guides</span>
              <h2 className="rd-h2">
                Are you just starting out?{" "}
                <span className="rd-mark">Let us help you make sense of it.</span>
              </h2>
              <p className="rd-lede" style={{ maxWidth: "52ch" }}>
                Not every founder or business owner starts with a plan — some start with a feeling. A
                feeling that you want to launch something… Build a brand that reflects who you are… Or
                finally bring your idea to life — without spending months (or money) trying to figure
                it out.
              </p>
              <p className="rd-lede" style={{ maxWidth: "52ch", marginTop: "0.9rem" }}>
                That&apos;s exactly why we built <strong>brandbizkit</strong>. We get it. Starting a
                business can feel overwhelming. So we simplified it.
              </p>
              <p style={{ marginTop: "1.6rem" }}>
                <a href="#services" className="rd-link">
                  Check our services below ↓
                </a>
              </p>
            </Reveal>
            <Reveal delay={80} className="rd-media-frame">
              <img
                src="/assets/karla-and-michael-AVLxNDqJ1OU449D2.png"
                alt="Karla and Michael, founders of BrandBizkit"
                width={640}
                height={480}
                loading="lazy"
              />
            </Reveal>
          </div>
        </section>

        {/* 6 — Services */}
        <section id="services" className="rd-section" style={anchor} data-od-id="services">
          <div className="rd-wrap">
            <Reveal className="rd-head--center">
              <span className="rd-eyebrow">Our services</span>
              <h2 className="rd-h2">Choose Your Goal</h2>
              <p className="rd-lede">
                Launch your brand effortlessly with our free AI tools kit recommendations and
                step-by-step guidance.
              </p>
            </Reveal>
            <div className="rd-grid rd-grid--3" style={{ marginTop: "3rem" }}>
              {SERVICES.map((s) => (
                <article
                  key={s.n}
                  id={s.n === "1" ? "biz-in-a-box" : undefined}
                  className="rd-card"
                  style={s.n === "1" ? anchor : undefined}
                  data-od-id={`service-card-${s.n}`}
                >
                  <div className="rd-card__media" style={{ aspectRatio: "16 / 10" }}>
                    <img src={s.image} alt={`${s.name} ${s.sub}`} width={480} height={300} loading="lazy" />
                  </div>
                  <h3 style={{ marginTop: "1.25rem", fontSize: "1.2rem" }}>
                    {s.n}. {s.name}{" "}
                    <span style={{ color: "var(--rd-accent)" }}>{s.sub}</span>
                  </h3>
                  <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", fontWeight: 500, color: "var(--rd-muted)" }}>
                    {s.blurb}
                  </p>
                  <ul style={{ margin: "0.75rem 0 0 1.1rem", display: "grid", gap: "0.5rem", fontSize: "0.9rem" }}>
                    {s.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                  <p style={{ marginTop: "auto", paddingTop: "1.25rem" }}>
                    <a href={s.href} className="rd-link">
                      Learn more →
                    </a>
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 7 — Empower */}
        <section className="rd-section" data-od-id="empower">
          <div className="rd-wrap rd-split">
            <Reveal>
              <span className="rd-eyebrow">Why brandbizkit</span>
              <h2 className="rd-h2">Empower Your Entrepreneurial Journey Today</h2>
              <p className="rd-lede" style={{ maxWidth: "52ch" }}>
                At brandbizkit, we empower aspiring entrepreneurs to launch their businesses
                effortlessly using curated, free AI tools, ensuring a smooth and guided experience.
              </p>
              <p style={{ marginTop: "1.8rem" }}>
                <a href="/ai-school" className="rd-btn rd-btn--ghost">
                  Learn More
                </a>
              </p>
            </Reveal>
            <Reveal delay={80}>
              <div style={{ position: "relative" }}>
                <div className="rd-media-frame">
                  <img
                    src="/assets/bb_laptop-YbNJEPyLNyhr9yo9.png"
                    alt="A laptop displaying an AI-powered dashboard — BrandBizkit makes AI approachable"
                    width={640}
                    height={480}
                    loading="lazy"
                  />
                </div>
                <figure className="rd-quote-card">
                  <blockquote>
                    <span aria-hidden="true" style={{ color: "var(--rd-accent)", marginRight: "0.15rem" }}>
                      &ldquo;
                    </span>
                    I now build a business for less entrepreneurial risk!
                  </blockquote>
                  <figcaption>
                    <span>Karla K.</span>
                  </figcaption>
                </figure>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 8 — Testimonial band */}
        <section className="rd-section rd-section--maroon" data-od-id="testimonial">
          <div className="rd-wrap" style={{ maxWidth: "44rem", textAlign: "center" }}>
            <p aria-hidden="true" className="rd-stars">
              ★★★★★
            </p>
            <blockquote
              style={{
                marginTop: "1rem",
                fontFamily: "var(--rd-display)",
                fontSize: "clamp(1.25rem, 1rem + 1.4vw, 1.75rem)",
                lineHeight: 1.45,
                color: "#fff",
              }}
            >
              &ldquo;brandbizkit helped me launch my business effortlessly. The step-by-step guidance
              and free tools made the process smooth and enjoyable. Highly recommended!&rdquo;
            </blockquote>
            <p style={{ marginTop: "1.25rem", color: "rgb(255 255 255 / 0.7)" }}>— Alex Smith</p>
          </div>
        </section>

        {/* 9 — Popular AI tools */}
        <section id="popularaitools" className="rd-section" style={anchor} data-od-id="popular-ai-tools">
          <div className="rd-wrap">
            <Reveal className="rd-head--center">
              <span className="rd-eyebrow">Learn the essentials</span>
              <h2 className="rd-h2">Popular AI Tools</h2>
              <p className="rd-lede">
                Learn more about the most popular and used AI tools by{" "}
                <span className="rd-mark">clicking the images below</span>
              </p>
            </Reveal>
            <div className="rd-grid rd-grid--3" style={{ marginTop: "3rem" }}>
              {tools.map((t) => {
                const img = t.cardImage ?? t.image;
                return (
                  <a
                    key={t.slug}
                    href={`/${t.slug}`}
                    className="rd-card rd-card--link"
                    style={{ padding: 0, overflow: "hidden" }}
                    data-od-id={`tool-card-${t.slug}`}
                  >
                    {img && (
                      <div className="rd-card__media" style={{ borderRadius: 0 }}>
                        <img
                          src={img}
                          alt={`${t.name} — what it is and how to use it`}
                          width={640}
                          height={360}
                          loading="lazy"
                        />
                      </div>
                    )}
                  </a>
                );
              })}
              <a
                href={`/${canonicalToolsSlug("top-free-ai-image-tools")}`}
                className="rd-card rd-card--link"
                style={{ padding: 0, overflow: "hidden" }}
                data-od-id="tool-card-leonardo"
              >
                <div className="rd-card__media" style={{ borderRadius: 0 }}>
                  <img
                    src="/assets/reimagined_leonardo_brandbizkit-Aq2Jrle7BDcxlkoz.png"
                    alt="Leonardo AI — free daily image generation for brand visuals"
                    width={640}
                    height={360}
                    loading="lazy"
                  />
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* 10 — Latest insights */}
        <section className="rd-section rd-section--light" data-od-id="latest-insights">
          <div className="rd-wrap">
            <Reveal className="rd-head--center">
              <span className="rd-eyebrow">From the blog</span>
              <h2 className="rd-h2">Latest Bizkit Insights</h2>
            </Reveal>
            <div className="rd-grid rd-grid--3" style={{ marginTop: "3rem" }}>
              {posts.map((p) => (
                <a
                  key={p.slug}
                  href={`/${p.slug}`}
                  className="rd-card rd-card--link"
                  style={{ padding: 0, overflow: "hidden" }}
                  data-od-id={`insight-card-${p.slug}`}
                >
                  {p.image && (
                    <div className="rd-card__media" style={{ borderRadius: 0 }}>
                      <img src={p.image} alt={p.title} width={480} height={270} loading="lazy" />
                    </div>
                  )}
                  <div style={{ padding: "1.25rem" }}>
                    <h3 style={{ fontSize: "1.02rem", lineHeight: 1.3 }}>{p.title}</h3>
                    <p
                      className="rd-clamp-2"
                      style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--rd-muted)" }}
                    >
                      {p.description}
                    </p>
                    <p style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: "rgb(29 30 32 / 0.5)" }}>
                      {p.author} · {p.date}
                      {p.readTime ? ` · ${p.readTime}` : ""}
                    </p>
                  </div>
                </a>
              ))}
            </div>
            <p style={{ marginTop: "2rem", textAlign: "center" }}>
              <a href="/ai-news" className="rd-link">
                View all insights →
              </a>
            </p>
          </div>
        </section>

        {/* 11 — Shared page tail (Start your business / PricingKits / Let's talk lead form) */}
        <ServicesTail source="home" />
      </div>

      <RedesignFooter site={site} />
    </>
  );
}
