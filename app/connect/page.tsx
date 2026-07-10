import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { getSite, getPosts, getVideos } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { pageSchema, schemaScript } from "@/lib/schema";
import VideoWithTranscript from "@/components/VideoWithTranscript";

type Mention = {
  title: string;
  url: string;
  source: string;
  type: string;
  date: string;
  quote: string;
};

function getMentions(): Mention[] {
  const p = path.join(process.cwd(), "content", "mentions.json");
  const data = JSON.parse(fs.readFileSync(p, "utf8"));
  return (data.mentions as Mention[]).filter((m) => m.url);
}

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Connect with BrandBizkit — Social Media, Videos & Press",
    description:
      "Follow BrandBizkit across Instagram, YouTube, TikTok, LinkedIn and more. Watch our AI tool videos with transcripts and see where BrandBizkit is mentioned across the web.",
    pathName: "/connect",
  });
}

const SOCIAL_META: Record<string, { label: string; blurb: string }> = {
  instagram: { label: "Instagram", blurb: "Daily AI tool tips, brand-building reels and behind-the-scenes." },
  youtube: { label: "YouTube", blurb: "Full AI tool walkthroughs and masterclasses — every video transcribed." },
  tiktok: { label: "TikTok", blurb: "Quick AI hacks for founders in under 60 seconds." },
  facebook: { label: "Facebook", blurb: "Community updates and live sessions." },
  linkedin: { label: "LinkedIn", blurb: "AI transformation insights for businesses and teams." },
  x: { label: "X (Twitter)", blurb: "Real-time AI news and product updates." },
};

export default function ConnectPage() {
  const site = getSite();
  const mentions = getMentions();
  const videos = getVideos();
  const posts = getPosts();
  const schema = pageSchema({
    pathName: "/connect",
    title: "Connect with BrandBizkit",
    description: "BrandBizkit's official social profiles, video library, and press mentions.",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaScript(schema) }} />
      <div className="mx-auto max-w-6xl px-4 py-14">
        <p className="section-eyebrow">Our digital footprint</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Connect with <span className="text-brand-accent">brandbizkit</span>
        </h1>
        <p className="mt-4 max-w-2xl text-brand-text/80">
          Our digital home is here — but the conversation happens everywhere. Follow along,
          watch, and see where BrandBizkit shows up across the web.
        </p>

        <h2 className="mt-14 font-display text-2xl font-bold md:text-3xl">Official profiles</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(site.social)
            .filter(([, url]) => url)
            .map(([key, url]) => (
              <a
                key={key}
                href={url}
                rel="me noopener"
                target="_blank"
                className="card card-hover p-5"
              >
                <p className="font-display text-lg font-semibold">{SOCIAL_META[key]?.label ?? key}</p>
                <p className="mt-1 text-sm text-brand-text/70">{SOCIAL_META[key]?.blurb}</p>
                <p className="mt-3 truncate text-xs text-brand-accent">{url}</p>
              </a>
            ))}
        </div>

        <h2 className="mt-14 font-display text-2xl font-bold md:text-3xl">Video library (with transcripts)</h2>
        <p className="mt-2 text-sm text-brand-text/70">
          Every BrandBizkit video ships with a full transcript so both people and AI search
          engines can find exactly the right moment.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {videos.map((v) => (
            <VideoWithTranscript key={v.id} video={v} />
          ))}
        </div>

        <h2 className="mt-14 font-display text-2xl font-bold md:text-3xl">From the blog</h2>
        <ul className="mt-4 grid gap-2">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/${p.slug}`} className="text-brand-accent hover:underline">
                {p.title}
              </Link>{" "}
              <span className="text-sm text-brand-text/50">· {p.date}</span>
            </li>
          ))}
        </ul>

        <h2 className="mt-14 font-display text-2xl font-bold md:text-3xl">Mentioned around the web</h2>
        {mentions.length === 0 ? (
          <p className="mt-3 text-brand-text/60">
            Press, directories, and articles that feature BrandBizkit will appear here.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4">
            {mentions.map((m) => (
              <li key={m.url} className="card p-5">
                <a href={m.url} rel="noopener" target="_blank" className="font-semibold text-brand-accent hover:underline">
                  {m.title}
                </a>
                <p className="mt-1 text-sm text-brand-text/60">
                  {m.source} {m.date && `· ${m.date}`}
                </p>
                {m.quote && <p className="mt-2 text-sm italic text-brand-text/75">“{m.quote}”</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
