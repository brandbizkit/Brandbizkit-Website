import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import type { Block, LandingPage } from "@/lib/content";

function isInternal(href?: string | null): boolean {
  return !!href && (href.startsWith("/") || href.startsWith("#"));
}

function BlockEl({ block }: { block: Block }) {
  const { tag, text, href } = block;
  switch (tag) {
    case "h1":
      return <h1 className="font-display text-4xl font-bold leading-tight text-brand-ink md:text-5xl">{text}</h1>;
    case "h2":
      return <h2 className="mt-10 font-display text-2xl font-bold text-brand-ink md:text-3xl">{text}</h2>;
    case "h3":
      return <h3 className="mt-8 font-display text-xl font-semibold text-brand-ink md:text-2xl">{text}</h3>;
    case "h4":
      return <h4 className="mt-6 font-display text-lg font-semibold text-brand-ink">{text}</h4>;
    case "li":
      return <li className="ml-5 list-disc leading-relaxed text-brand-text/90 marker:text-brand-accent">{text}</li>;
    case "blockquote":
      return (
        <blockquote className="border-l-4 border-brand-accent pl-4 italic text-brand-text/75">{text}</blockquote>
      );
    case "a":
    case "button": {
      if (!href) return null;
      return isInternal(href) ? (
        <Link href={href} className="btn btn-secondary self-start">{text}</Link>
      ) : (
        <a href={href} rel="noopener" className="btn btn-secondary self-start">{text}</a>
      );
    }
    default:
      return <p className="leading-relaxed text-brand-text/85">{text}</p>;
  }
}

/**
 * Generic renderer for migrated landing pages: ordered content blocks followed
 * by the page's image gallery. Keeps 1:1 copy parity with the live site while
 * individual pages get upgraded to bespoke sections over time.
 */
export default function BlockRenderer({
  page,
  bannerImage,
}: {
  page: LandingPage;
  /** When set, renders one image right below the h1 instead of the trailing
   *  repeated-image gallery — used by the persona-quiz result pages. */
  bannerImage?: { src: string; alt: string };
}) {
  const blocks = page.blocks;
  const hasH1 = blocks.some((b) => b.tag === "h1");
  const firstH1Index = blocks.findIndex((b) => b.tag === "h1");

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <div className="flex flex-col gap-4">
        {!hasH1 && page.h1 && (
          <h1 className="font-display text-4xl font-bold leading-tight text-brand-ink md:text-5xl">
            {page.h1}
          </h1>
        )}
        {blocks.map((b, i) => (
          <Fragment key={i}>
            <BlockEl block={b} />
            {bannerImage && i === firstH1Index && (
              <Image
                src={bannerImage.src}
                alt={bannerImage.alt}
                width={896}
                height={480}
                priority
                className="w-full rounded-2xl object-cover shadow-[0_18px_44px_rgb(13_20_26/0.12)]"
              />
            )}
          </Fragment>
        ))}
      </div>

      {!bannerImage && page.images.length > 0 && (
        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3">
          {page.images.map((img, i) => (
            <Image
              key={`${img.src}-${i}`}
              src={img.src}
              alt={img.alt || page.h1}
              width={480}
              height={360}
              className="card card-hover h-auto w-full object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}
