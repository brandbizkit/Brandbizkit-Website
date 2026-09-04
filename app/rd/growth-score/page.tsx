import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { interpolateYear } from "@/lib/year";
import GrowthScore, { type GrowthScoreConfig } from "@/components/GrowthScore";
import { StickerPerson } from "../_components/People";

export const metadata: Metadata = {
  title: "Business Growth Score — BrandBizkit Design Preview",
  robots: { index: false, follow: false },
};

function getConfig(): GrowthScoreConfig {
  const config: GrowthScoreConfig = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content", "growth-score.json"), "utf8")
  );
  if (config.aiAdoptionRec?.secondaryCta) {
    config.aiAdoptionRec.secondaryCta.href = interpolateYear(config.aiAdoptionRec.secondaryCta.href);
  }
  return config;
}

export default function RdGrowthScore() {
  const config = getConfig();
  return (
    <>
      <section style={{ position: "relative", padding: "56px 0 20px", textAlign: "center" }}>
        <div aria-hidden className="rd-dots" style={{ position: "absolute", inset: 0, opacity: 0.1 }} />
        <div className="rd-wrap" style={{ position: "relative" }}>
          <span className="rd-sticker" style={{ transform: "rotate(-2deg)" }}>Free · 3 minutes</span>
          <h1 className="rd-rise" style={{ marginTop: 18, fontSize: "clamp(36px,3.6vw+12px,60px)" }}>
            Where does your business <span className="rd-mark">actually</span> stand?
          </h1>
          <p className="rd-lead" style={{ marginTop: 16, maxWidth: "40rem", marginLeft: "auto", marginRight: "auto" }}>
            14 quick questions on brand, online presence, customers and systems — then a personalized
            dashboard showing exactly what to fix first. A human reviews every result.
          </p>
          <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 6 }}>
            <StickerPerson skin="light" shirt="#ff4232" hair={0} size={64} style={{ transform: "rotate(-6deg)" }} />
            <StickerPerson skin="deep" shirt="#697bdc" hair={1} size={64} />
            <StickerPerson skin="warm" shirt="#f3c82e" hair={2} size={64} style={{ transform: "rotate(6deg)" }} />
          </div>
        </div>
      </section>

      <section style={{ padding: "24px 0 90px" }}>
        <div className="rd-wrap">
          <div className="rd-chunk" style={{ padding: "clamp(20px, 3vw, 40px)", background: "var(--paper)" }}>
            <GrowthScore config={config} />
          </div>
        </div>
      </section>
    </>
  );
}
