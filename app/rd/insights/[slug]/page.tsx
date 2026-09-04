import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPosts, getPost } from "@/lib/content";
import { mdToHtml } from "@/lib/markdown";
import { CharacterBust } from "../../_components/Cast";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return {
    title: post ? `${post.title} — BrandBizkit Design Preview` : "Insight — BrandBizkit Design Preview",
    robots: { index: false, follow: false },
  };
}

export default async function RdInsightArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const html = mdToHtml(post.body);

  return (
    <article>
      <header style={{ position: "relative", background: "var(--cream)", borderBottom: "3px solid var(--ink)", padding: "56px 0" }}>
        <div aria-hidden className="rd-dots" style={{ position: "absolute", inset: 0, opacity: 0.1 }} />
        <div className="rd-wrap" style={{ position: "relative", maxWidth: 760 }}>
          <Link href="/rd/insights" style={{ fontWeight: 800, fontSize: 14 }}>← All insights</Link>
          <h1 style={{ marginTop: 16, fontSize: "clamp(30px,3vw+14px,50px)" }}>{post.title}</h1>
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12 }}>
            <CharacterBust id="operator" size={44} />
            <p style={{ fontSize: 14, color: "rgba(29,30,32,0.6)", fontWeight: 600 }}>
              {post.author} · {post.date}{post.readTime ? ` · ${post.readTime}` : ""}
            </p>
          </div>
        </div>
      </header>

      <div className="rd-wrap" style={{ padding: "56px 0 90px" }}>
        <div className="rd-prose" dangerouslySetInnerHTML={{ __html: html }} />

        <div className="rd-chunk" style={{ maxWidth: "46rem", margin: "48px auto 0", padding: "26px 30px", background: "var(--yellow)", color: "var(--ink)", transform: "rotate(-1deg)" }}>
          <strong style={{ fontSize: 18 }}>Want the tools behind this?</strong>
          <p style={{ marginTop: 6, fontSize: 15, color: "rgba(13,20,26,0.8)" }}>
            The free AI tools directory has every one, with real free-tier limits.
          </p>
          <Link href="/rd/tools" className="rd-btn coral" style={{ marginTop: 14 }}>Browse free AI tools →</Link>
        </div>
      </div>
    </article>
  );
}
