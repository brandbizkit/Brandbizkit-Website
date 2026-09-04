import type { Metadata } from "next";
import "./redesign.css";

export const metadata: Metadata = {
  title: "BrandBizkit — Redesign Preview",
  description:
    "Parallel visual redesign of the BrandBizkit homepage, served alongside the live site for side-by-side comparison.",
  robots: { index: false, follow: false },
};

/*
 * This route inherits the app-wide root layout (app/layout.tsx), which renders
 * the live <Nav> and <Footer> as direct children of <body>. The redesign ships
 * its own chrome, so the two inherited elements are hidden here only — the rule
 * lives in this segment's rendered markup, so it is gone the moment you leave
 * /redesign and never affects the live site. No existing file is modified.
 */
const HIDE_INHERITED_CHROME = `
  body > header:not(.rd-nav) { display: none !important; }
  body > footer:not(.rd-footer) { display: none !important; }
`;

export default function RedesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rd">
      <style dangerouslySetInnerHTML={{ __html: HIDE_INHERITED_CHROME }} />
      {children}
    </div>
  );
}
