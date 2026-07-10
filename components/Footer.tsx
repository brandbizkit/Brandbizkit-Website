import Link from "next/link";
import type { SiteConfig } from "@/lib/content";

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  x: "X (Twitter)",
};

const EXPECT_ICONS = ["🧰", "🗺️", "🎨", "🚀"];

export default function Footer({ site }: { site: SiteConfig }) {
  return (
    <footer>
      {/* Expect strip stays light, above the gradient band */}
      <div className="border-t border-brand-ink/8 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="text-center font-display text-2xl font-bold text-brand-ink md:text-3xl">
            What you can expect from{" "}
            <span className="text-brand-accent">{site.name.toLowerCase()}</span>
          </h3>
          <ul className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {site.footerExpect.map((item, i) => (
              <li key={item} className="card card-hover p-6 text-sm leading-relaxed text-brand-text/85">
                <span aria-hidden className="mb-3 block text-2xl">{EXPECT_ICONS[i % EXPECT_ICONS.length]}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Original footer: red-orange gradient with Empower · Build · Create */}
      <div className="bg-brand-gradient text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="flex flex-wrap items-baseline gap-x-3 font-display text-3xl font-bold md:text-4xl">
            <span>Empower</span>
            <span aria-hidden className="text-white/40">·</span>
            <span>Build</span>
            <span aria-hidden className="text-white/40">·</span>
            <span>Create</span>
          </p>
          <p className="mt-3 max-w-md text-white/90">Launch your brand with free AI tools today.</p>

          <div className="mt-10 flex flex-col gap-6 border-t border-white/25 pt-8 md:flex-row md:items-center md:justify-between">
            <nav aria-label="Social media">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {Object.entries(site.social)
                  .filter(([, url]) => url)
                  .map(([key, url]) => (
                    <li key={key}>
                      <a
                        href={url}
                        rel="me noopener"
                        target="_blank"
                        className="text-sm font-medium text-white/85 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {SOCIAL_LABELS[key] ?? key}
                      </a>
                    </li>
                  ))}
              </ul>
            </nav>

            <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
              <Link href="/terms-and-conditions" className="transition hover:text-white">Terms and Conditions</Link>
              <Link href="/privacy-policy" className="transition hover:text-white">Privacy Policy</Link>
              <Link href="/connect" className="transition hover:text-white">Connect &amp; Mentions</Link>
              <a href="/llms.txt" className="transition hover:text-white">llms.txt</a>
              <a href="/feed.xml" className="transition hover:text-white">RSS</a>
            </nav>
          </div>

          <p className="mt-8 text-sm text-white/65">
            © {site.name.toLowerCase()} {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
