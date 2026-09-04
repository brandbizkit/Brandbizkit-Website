import type { SiteConfig } from "@/lib/content";
import NewsletterSignup from "@/components/NewsletterSignup";

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  linkedin: "LinkedIn",
};

/**
 * Redesigned footer. Same structure and copy as components/Footer.tsx — the
 * "what you can expect" strip, the gradient slogan band, the newsletter signup
 * (reusing the live <NewsletterSignup source="footer">, so the /api/subscribe
 * integration is untouched), socials and legal links. Restyled only.
 */
export default function RedesignFooter({ site }: { site: SiteConfig }) {
  return (
    <footer className="rd-footer" data-od-id="redesign-footer">
      <section className="rd-foot-expect">
        <div className="rd-wrap">
          <h3 style={{ textAlign: "center", fontSize: "clamp(1.5rem, 1.1rem + 1.6vw, 2rem)" }}>
            What you can expect from <span style={{ color: "var(--rd-accent)" }}>{site.name.toLowerCase()}</span>
          </h3>
          <ul
            className="rd-grid rd-grid--4"
            style={{ marginTop: "2.5rem", listStyle: "none", padding: 0 }}
          >
            {site.footerExpect.map((item, i) => (
              <li key={item} className="rd-card">
                <span className="rd-numeral">{String(i + 1).padStart(2, "0")}</span>
                <p style={{ marginTop: "0.75rem", fontSize: "0.95rem", color: "var(--rd-muted)" }}>
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="rd-foot-band">
        <div className="rd-wrap rd-foot-band__inner">
          <p className="rd-foot-slogan">
            <span>Empower</span>
            <span aria-hidden="true">·</span>
            <span>Build</span>
            <span aria-hidden="true">·</span>
            <span>Create</span>
          </p>
          <p style={{ marginTop: "0.85rem", maxWidth: "28rem", color: "rgb(255 255 255 / 0.9)" }}>
            Launch your brand with free AI tools today.
          </p>

          <div className="rd-foot-col" style={{ maxWidth: "32rem" }}>
            <p style={{ fontFamily: "var(--rd-display)", fontWeight: 700, fontSize: "1.05rem" }}>
              Join the newsletter
            </p>
            <p style={{ marginTop: "0.4rem", fontSize: "0.9rem", color: "rgb(255 255 255 / 0.8)" }}>
              Free AI tools, guides and brand templates — straight to your inbox.
            </p>
            <div style={{ marginTop: "1rem" }}>
              <NewsletterSignup source="footer" variant="dark" />
            </div>
          </div>

          <div
            className="rd-foot-col"
            style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "space-between" }}
          >
            <nav aria-label="Social media">
              <ul className="rd-foot-links">
                {Object.entries(site.social)
                  .filter(([, url]) => url)
                  .map(([key, url]) => (
                    <li key={key}>
                      <a href={url} rel="me noopener" target="_blank">
                        {SOCIAL_LABELS[key] ?? key}
                      </a>
                    </li>
                  ))}
              </ul>
            </nav>
            <nav aria-label="Footer">
              <ul className="rd-foot-links">
                <li>
                  <a href="/redesign#lets-talk" style={{ fontWeight: 600 }}>
                    Get in Touch
                  </a>
                </li>
                <li>
                  <a href="/terms-and-conditions">Terms and Conditions</a>
                </li>
                <li>
                  <a href="/privacy-policy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/connect">Connect &amp; Mentions</a>
                </li>
                <li>
                  <a href="/llms.txt">llms.txt</a>
                </li>
                <li>
                  <a href="/feed.xml">RSS</a>
                </li>
              </ul>
            </nav>
          </div>

          <p style={{ marginTop: "2rem", fontSize: "0.85rem", color: "rgb(255 255 255 / 0.66)" }}>
            © {site.name.toLowerCase()} {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
