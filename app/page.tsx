import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { pageSchema, schemaScript } from "@/lib/schema";
import { getTools, getPosts, getVideosForPage } from "@/lib/content";
import { canonicalToolsSlug } from "@/lib/tools-directory";
import ServicesTail from "@/components/ServicesTail";
import VideoWithTranscript from "@/components/VideoWithTranscript";
import PersonaQuiz from "@/components/PersonaQuiz";
import PodcastWidget from "@/components/PodcastWidget";
import ToolCategoryButtons from "@/components/ToolCategoryButtons";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Launch Your Brand with FREE AI Tools for your business | BrandBizkit",
    description:
      "Empower your entrepreneurial journey with brandbizkit. Access free AI tools for businesses, step-by-step guides, and other brand building resources. Start smart and build fast with our comprehensive platform designed for aspiring entrepreneurs. No design or coding skills needed.",
    pathName: "/",
    image: "/assets/brandbizkit-hero-background3-A0xjDaGWoRIpJQ9B.png",
  });
}

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
    href: "/#biz-in-a-box",
    image: "/assets/brandbizkit_biz-in-a-box2-mePJRokbwDHjM92w.png",
  },
  {
    n: "2",
    name: "Ai Tools Education",
    sub: "(Ai School)",
    blurb: "Helping businesses use Ai in their day-to-day:",
    items: [
      "Training / Masterclasses: Workshops, webinars, and private sessions teaching AI tools for branding, content, workflows, and business operations.",
      "Affiliate Tool Operations: Technical setup + integration of AI and no-code tools (automation, CRM, funnels, chatbots, analytics).",
    ],
    href: "/ai-school",
    image: "/assets/bb_laptop-YbNJEPyLNyhr9yo9.png",
  },
  {
    n: "3",
    name: "Ai Transformation",
    sub: "(Consulting)",
    blurb: "End2end AI adoption strategy for organizations:",
    items: [
      "Problem Diagnosis (Business Assessment): Business Impact Assessment + AI Readiness Scan to identify gaps, inefficiencies, and opportunities.",
      "Strategic AI Transformation: Redesigning processes, operating models, and customer experiences using AI to drive growth, cost-savings, and innovation.",
    ],
    href: "/#lets-talk",
    image: "/assets/bb_computer-YNq2RaNbjzs6nnOv.png",
  },
];

export default function HomePage() {
  const tools = getTools();
  const posts = getPosts().slice(0, 3);
  const videos = getVideosForPage("/");
  const schema = pageSchema({
    pathName: "/",
    title: "Launch Your Brand with FREE AI Tools for your business | BrandBizkit",
    description:
      "Empower your entrepreneurial journey with brandbizkit. Access free AI tools for businesses, step-by-step guides, and other brand building resources.",
    image: "/assets/brandbizkit-hero-background3-A0xjDaGWoRIpJQ9B.png",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaScript(schema) }} />
      <PodcastWidget />

      {/* Hero — original red-gradient background image (fixed on desktop, mobile variant below md) */}
      <section className="relative bg-cover bg-center bg-[url('/assets/brandbizkit-hero-mobile-background2-YbNJRPl7Xeue9WOL.png')] md:bg-fixed md:bg-[url('/assets/brandbizkit-hero-background3-A0xjDaGWoRIpJQ9B.png')]">
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/10 to-transparent" />
        <div className="relative mx-auto flex max-w-6xl px-4 py-24 md:py-36">
          <div className="max-w-xl text-left">
            <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-[0_2px_10px_rgb(0_0_0/0.25)] md:text-6xl">
              FREE Ai Tools, Templates, &amp; Guides in ONE BIZKIT
            </h1>
            <p className="mt-6 text-lg text-white/95">
              brandbizkit empowers aspiring entrepreneurs to launch brands or businesses using
              curated, free AI tools—with zero coding, zero overwhelm, and step-by-step guidance.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/growth-score"
                className="btn border-[3px] border-white bg-brand-yellow px-8 text-xl font-bold text-brand-ink shadow-[0_8px_24px_rgb(0_0_0/0.25)] hover:bg-brand-ink hover:text-white md:text-2xl"
              >
                &gt;&gt;Start&lt;&lt;
              </Link>
              <a
                href="#popularaitools"
                className="btn border-2 border-white px-8 text-xl font-semibold text-white hover:bg-white hover:text-brand-ink"
              >
                🚀 Top FREE AI Tools
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Persona quiz — right under the hero, as on the original */}
      <section id="persona-quiz" className="scroll-mt-20 bg-brand-blue-band py-16">
        <div className="mx-auto max-w-5xl px-4">
          <PersonaQuiz />
        </div>
      </section>

      {/* Top FREE AI Tools banner + red category buttons */}
      <ToolCategoryButtons />

      {/* Why 10x — video left, green checklist + Big Idea card right */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <p className="section-eyebrow">Work smarter</p>
            <h2 className="section-title mt-2">
              🚀 Why Learning This Will 10x Your Brand{" "}
              <span className="text-brand-accent">(Without Burning Out)</span>
            </h2>
          </div>
          <p className="mx-auto mt-4 max-w-3xl text-center text-brand-text/90">
            Let&apos;s be real. Starting a brand or business used to mean spending months designing,
            writing, planning, and guessing. Now? You can launch faster than ever —{" "}
            <strong>if you know how to use the right AI tools</strong>.
          </p>
          <div className="mt-10 grid items-start gap-10 md:grid-cols-2">
            <div className="grid gap-6">
              {videos.map((v) => (
                <VideoWithTranscript key={v.id} video={v} />
              ))}
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">Here&apos;s why that matters:</h3>
              <ul className="mt-4 grid gap-3">
                {TEN_X.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-brand-text/90">
                    <span aria-hidden className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm text-green-700">
                      ✓
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-2xl bg-gradient-to-br from-[#FF4B2B] to-[#FF416C] p-6 text-center text-white shadow-lg">
                <p className="font-display text-xl font-bold">Big Idea</p>
                <p className="mt-2 text-white/95">
                  brandbizkit isn&apos;t just a toolkit. It&apos;s your new way of working — faster,
                  smarter, and way more fun.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Just starting out */}
      <section className="bg-brand-light py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
          <div>
            <p className="section-eyebrow">Meet your guides</p>
            <h2 className="section-title mt-2">
              Are you just starting out?{" "}
              <span className="text-brand-accent">Let us help you make sense of it.</span>
            </h2>
            <p className="mt-4 text-brand-text/90">
              Not every founder or business owner starts with a plan — some start with a feeling. A
              feeling that you want to launch something… Build a brand that reflects who you are… Or
              finally bring your idea to life — without spending months (or money) trying to figure
              it out.
            </p>
            <p className="mt-4 text-brand-text/90">
              That&apos;s exactly why we built <strong>brandbizkit</strong>. We get it. Starting a
              business can feel overwhelming. So we simplified it.
            </p>
            <a
              href="#services"
              className="btn btn-outline mt-7"
            >
              Check our services below ↓
            </a>
          </div>
          <Image
            src="/assets/karla-and-michael-AVLxNDqJ1OU449D2.png"
            alt="Karla and Michael, founders of BrandBizkit"
            width={640}
            height={480}
            className="rounded-2xl object-cover shadow-[0_18px_44px_rgb(13_20_26/0.14)]"
          />
        </div>
      </section>

      {/* Services — Choose Your Goal */}
      <section id="services" className="scroll-mt-20 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="section-eyebrow block text-center">Our services</p>
          <h2 className="section-title mt-2 text-center">Choose Your Goal</h2>
          <p className="section-sub mx-auto text-center">
            Launch your brand effortlessly with our free AI tools kit recommendations and
            step-by-step guidance.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <article
                key={s.n}
                id={s.n === "1" ? "biz-in-a-box" : undefined}
                className="card card-hover flex flex-col p-6"
              >
                <Image src={s.image} alt={`${s.name} ${s.sub}`} width={480} height={280} className="h-44 w-full rounded-xl object-cover" />
                <h3 className="mt-5 font-display text-xl font-bold">
                  {s.n}. {s.name} <span className="text-brand-accent">{s.sub}</span>
                </h3>
                <p className="mt-2 text-sm font-medium text-brand-text/70">{s.blurb}</p>
                <ul className="mt-3 grid gap-2 text-sm text-brand-text/90">
                  {s.items.map((i) => (
                    <li key={i} className="ml-4 list-disc">{i}</li>
                  ))}
                </ul>
                <Link href={s.href} className="mt-auto pt-5 font-semibold text-brand-periwinkle hover:underline">
                  Learn more →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Empower */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
          <div>
            <p className="section-eyebrow">Why brandbizkit</p>
            <h2 className="section-title mt-2">Empower Your Entrepreneurial Journey Today</h2>
            <p className="mt-4 text-brand-text/90">
              At brandbizkit, we empower aspiring entrepreneurs to launch their businesses
              effortlessly using curated, free AI tools, ensuring a smooth and guided experience.
            </p>
            <Link
              href="/ai-school"
              className="btn btn-secondary mt-7"
            >
              Learn More
            </Link>
          </div>
          <div className="relative">
            <Image
              src="/assets/bb_laptop-YbNJEPyLNyhr9yo9.png"
              alt="A laptop displaying an AI-powered dashboard — BrandBizkit makes AI approachable"
              width={640}
              height={480}
              className="w-full rounded-2xl object-cover"
            />
            <figure className="absolute -bottom-6 right-4 max-w-60 rounded-xl bg-white p-4 shadow-xl">
              <blockquote className="text-sm font-semibold text-brand-ink">
                <span aria-hidden className="mr-1 text-brand-accent">“</span>
                I now build a business for less entrepreneurial risk!
              </blockquote>
              <figcaption className="mt-2 text-xs text-brand-text/60">Karla K.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Dark maroon testimonial band (original) */}
      <section className="bg-[#5C1D0F] py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <p aria-hidden className="text-2xl tracking-[0.3em] text-brand-yellow">★★★★★</p>
          <blockquote className="mt-4 font-display text-xl leading-relaxed md:text-2xl">
            “brandbizkit helped me launch my business effortlessly. The step-by-step guidance and
            free tools made the process smooth and enjoyable. Highly recommended!”
          </blockquote>
          <p className="mt-4 text-white/70">— Alex Smith</p>
        </div>
      </section>

      {/* Popular AI tools — six cards like the original */}
      <section id="popularaitools" className="scroll-mt-20 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="section-eyebrow block text-center">Learn the essentials</p>
          <h2 className="section-title mt-2 text-center">Popular Ai Tools</h2>
          <p className="section-sub mx-auto text-center">
            Learn more about the most popular and used AI tools by{" "}
            <strong className="text-brand-accent">clicking the images below</strong>
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <Link
                key={t.slug}
                href={`/${t.slug}`}
                className="card card-hover group overflow-hidden"
              >
                {(t.cardImage ?? t.image) && (
                  <Image
                    src={t.cardImage ?? t.image!}
                    alt={`${t.name} — what it is and how to use it`}
                    width={640}
                    height={360}
                    className="aspect-video w-full object-cover transition group-hover:scale-105"
                  />
                )}
              </Link>
            ))}
            <Link
              href={`/${canonicalToolsSlug("top-free-ai-image-tools")}`}
              className="card card-hover group overflow-hidden"
            >
              <Image
                src="/assets/reimagined_leonardo_brandbizkit-Aq2Jrle7BDcxlkoz.png"
                alt="Leonardo AI — free daily image generation for brand visuals"
                width={640}
                height={360}
                className="aspect-video w-full object-cover transition group-hover:scale-105"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest insights */}
      <section className="bg-brand-light py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="section-eyebrow block text-center">From the blog</p>
          <h2 className="section-title mt-2 text-center">Latest Bizkit Insights</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="card card-hover group overflow-hidden"
              >
                {p.image && (
                  <Image src={p.image} alt={p.title} width={480} height={204} className="h-40 w-full object-cover" />
                )}
                <div className="p-5">
                  <h3 className="font-display font-semibold leading-snug text-brand-ink group-hover:text-brand-periwinkle">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-brand-text/70">{p.description}</p>
                  <p className="mt-3 text-xs text-brand-text/50">
                    {p.author} · {p.date}{p.readTime ? ` · ${p.readTime}` : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link href="/ai-news" className="font-semibold text-brand-periwinkle hover:underline">
              View all insights →
            </Link>
          </p>
        </div>
      </section>

      <ServicesTail source="home" />
    </>
  );
}
