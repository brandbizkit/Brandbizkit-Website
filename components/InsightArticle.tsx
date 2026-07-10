import Image from "next/image";
import type { Post } from "@/lib/content";
import { mdToHtml } from "@/lib/markdown";
import ArticleChart from "./ArticleCharts";

/**
 * Shared Bizkit Insights article renderer — used by the public post page and
 * the /admin draft preview so drafts are reviewed exactly as they'd publish.
 *
 * Charts from frontmatter are placed wherever the markdown body contains a
 * `[chart:N]` marker on its own line; any charts without a marker are
 * appended after the body.
 */
export default function InsightArticle({ post }: { post: Post }) {
  const html = mdToHtml(post.body);
  const charts = post.charts ?? [];
  const placed = new Set<number>();

  // Split the rendered HTML on <p>[chart:N]</p> markers.
  const parts: (string | number)[] = [];
  const re = /<p>\s*\[chart:(\d+)\]\s*<\/p>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    parts.push(html.slice(last, m.index));
    const idx = Number(m[1]);
    parts.push(idx);
    placed.add(idx);
    last = m.index + m[0].length;
  }
  parts.push(html.slice(last));

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <p className="section-eyebrow">Bizkit Insights</p>
      <h1 className="mt-3 font-display text-3xl font-bold leading-tight md:text-4xl">
        {post.title}
      </h1>
      <p className="mt-4 text-sm text-brand-text/60">
        By {post.author} · Published {post.date}
        {post.readTime ? ` · ${post.readTime}` : ""}
        {post.updated ? ` · Updated ${post.updated}` : ""}
      </p>
      {post.image && (
        <Image
          src={post.image}
          alt={post.imageAlt ?? post.title}
          width={1024}
          height={434}
          priority
          className="mt-8 w-full rounded-2xl object-cover shadow-[0_18px_44px_rgb(13_20_26/0.12)]"
        />
      )}
      <div className="mt-8">
        {parts.map((part, i) =>
          typeof part === "number" ? (
            charts[part] ? <ArticleChart key={`c${i}`} chart={charts[part]} /> : null
          ) : (
            <div key={i} className="prose-bb" dangerouslySetInnerHTML={{ __html: part }} />
          )
        )}
        {charts.map((c, i) =>
          placed.has(i) ? null : <ArticleChart key={`tail${i}`} chart={c} />
        )}
      </div>
    </article>
  );
}
