import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { pageSchema, schemaScript } from "@/lib/schema";
import GrowthScore, { type GrowthScoreConfig } from "@/components/GrowthScore";

function getConfig(): GrowthScoreConfig {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content", "growth-score.json"), "utf8")
  );
}

const TITLE = "The Business Growth Score — Free 3-Minute Assessment";
const DESCRIPTION =
  "Answer 14 quick questions and get a personalized dashboard showing where your business stands on brand, online presence, customers, and systems — plus exactly what to fix first.";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: `${TITLE} | BrandBizkit`,
    description: DESCRIPTION,
    pathName: "/growth-score",
  });
}

export default function GrowthScorePage() {
  const config = getConfig();
  const schema = pageSchema({
    pathName: "/growth-score",
    title: TITLE,
    description: DESCRIPTION,
  });
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaScript(schema) }}
      />
      <section className="bg-brand-blue-band py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <GrowthScore config={config} />
        </div>
      </section>
    </>
  );
}
