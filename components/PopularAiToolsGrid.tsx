import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getTools } from "@/lib/content";
import { canonicalToolsSlug } from "@/lib/tools-directory";

/**
 * "Popular Ai Tools" six-card grid — originally only on the homepage,
 * reused on /popular-ai-tools too so both surfaces show the same
 * always-current picks instead of a separate hand-written section.
 */
export default function PopularAiToolsGrid({
  id,
  heading = "Popular AI Tools",
  sub = "Learn more about the most popular and used AI tools by clicking the images below",
  headingLevel = "h2",
}: {
  id?: string;
  heading?: string;
  sub?: ReactNode;
  /** Use "h1" when this grid is the page's main heading (e.g. /popular-ai-tools). */
  headingLevel?: "h1" | "h2";
}) {
  const tools = getTools();
  const Heading = headingLevel;
  return (
    <section id={id} className="scroll-mt-20 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <p className="section-eyebrow block text-center">Learn the essentials</p>
        <Heading className="section-title mt-2 text-center">{heading}</Heading>
        <p className="section-sub mx-auto text-center">{sub}</p>
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
  );
}
