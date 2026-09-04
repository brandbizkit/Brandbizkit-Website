import type { Metadata } from "next";
import { getToolsDirectory } from "@/lib/tools-directory";
import ToolExplorerRD, { type RdTool } from "../_components/ToolExplorerRD";
import { StickerPerson } from "../_components/People";

export const metadata: Metadata = {
  title: "Free AI Tools — BrandBizkit Design Preview",
  robots: { index: false, follow: false },
};

export default function RdTools() {
  const dir = getToolsDirectory();
  const tools: RdTool[] = dir.categories.flatMap((c) =>
    c.tools.map((t) => ({
      name: t.name,
      cat: c.title,
      note: t.why,
      free: t.freeDetails,
      url: t.url,
    }))
  );
  const count = tools.length;

  return (
    <>
      <section style={{ position: "relative", padding: "60px 0 30px" }}>
        <div aria-hidden className="rd-dots" style={{ position: "absolute", inset: 0, opacity: 0.1 }} />
        <div className="rd-wrap" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "center" }}>
          <div>
            <span className="rd-sticker" style={{ transform: "rotate(-2deg)" }}>The directory</span>
            <h1 className="rd-rise" style={{ marginTop: 20, fontSize: "clamp(38px,4vw+12px,68px)" }}>
              {count} free AI tools.<br /><span className="rd-mark">Zero</span> guesswork.
            </h1>
            <p className="rd-lead" style={{ marginTop: 18, maxWidth: "34rem" }}>
              Every tool with its real free-tier limits, a plain-English &ldquo;what it&rsquo;s for&rdquo;, and an honest
              note when the free tier needs a technical setup. Filter by what you&rsquo;re trying to do.
            </p>
            <p style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: "rgba(29,30,32,0.55)" }}>{dir.updateNote}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <StickerPerson skin="warm" shirt="#697bdc" hair={0} size={120} style={{ transform: "rotate(-4deg)" }} />
            <StickerPerson skin="deep" shirt="#f3c82e" hair={2} size={120} style={{ marginLeft: -22, transform: "rotate(5deg)" }} />
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 90 }}>
        <div className="rd-wrap">
          <ToolExplorerRD tools={tools} />
        </div>
      </section>
    </>
  );
}
