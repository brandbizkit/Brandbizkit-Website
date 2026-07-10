import Link from "next/link";
import Image from "next/image";
import { canonicalToolsSlug } from "@/lib/tools-directory";

const CATEGORIES = [
  { base: "top-free-ai-tools", label: "Top AI tools", image: "/assets/top-ai-tools_brandbizkit-AoP4labKrJtGWMb8.png" },
  { base: "top-free-ai-image-tools", label: "Image tools", image: "/assets/top-ai-image-tools_brandbizkit-AQEe16WoOvHLKjbj.png" },
  { base: "top-free-ai-video-tools", label: "Video tools", image: "/assets/top-ai-video-tools_brandbizkit-YbN4G6g0rxH6yKqN.png" },
  { base: "top-free-ai-no-code-tools", label: "Web app tools", image: "/assets/top-ai-web-app-tools_brandbizkit-mjE4yjbKeMty37gw.png" },
];

/**
 * The "🚀 Top FREE AI Tools" banner + four red category buttons that appear
 * across the original site's pages, linking to the (year-rolling) tools pages.
 */
export default function ToolCategoryButtons() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <Link
          href={`/${canonicalToolsSlug("top-free-ai-tools")}`}
          className="block rounded-2xl bg-brand-periwinkle py-6 text-center font-display text-2xl font-bold text-white shadow-[0_10px_30px_rgb(105_123_220/0.35)] transition hover:-translate-y-0.5 hover:bg-brand-periwinkle-dark hover:shadow-[0_14px_36px_rgb(105_123_220/0.45)] md:text-4xl"
        >
          🚀 Top FREE AI Tools
        </Link>
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.base}
              href={`/${canonicalToolsSlug(c.base)}`}
              className="rounded-2xl transition duration-200 hover:-translate-y-1.5 hover:drop-shadow-[0_14px_20px_rgb(255_66_50/0.3)]"
            >
              <Image
                src={c.image}
                alt={`${c.label} — free AI tools`}
                width={349}
                height={233}
                className="h-auto w-full"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
