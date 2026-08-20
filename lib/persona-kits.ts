/**
 * Brand Launch Kit tool selection.
 *
 * Two layers:
 *  1. PERSONA_KITS — the default 4 tools shown when someone lands on a
 *     result page cold (shared link, direct visit, no quiz answers in the
 *     URL). Picked to match what that persona's quiz-defining answers imply
 *     they need (see the comment above each entry).
 *  2. getPersonalizedKit() — when the quiz itself linked here, it carries the
 *     visitor's actual answers (obstacle picks from Q6, business type from
 *     Q3, AI comfort from Q7) as query params, and this recomputes the kit
 *     from those specific answers instead of the generic persona default.
 *
 * All tool names must match a `name` field exactly somewhere in
 * content/tools-directory.json — findDirectoryTool() pulls the live
 * description/pricing from there, so this file only decides the *selection*,
 * never the copy (that stays in one maintained place).
 */

// Q1/Q2/Q5/Q7 are what actually determine which persona someone lands on
// (see components/PersonaQuiz.tsx QUESTIONS[].logic). Each default kit below
// is built to match what *those specific answers* imply someone in that
// bucket needs — not just a generic "vibe" for the persona name.
export const PERSONA_KITS: Record<string, string[]> = {
  // Dreamer = q1 "idea but haven't started" / "just curious", q2 "Blank Canvas",
  // q5 "Create my brand identity" or "Validate my idea", q7 comfort 1-2 (new to AI).
  // Needs: low-friction thinking partners for clarity + validation, not execution tools.
  "dreamer-persona-quiz": ["Claude", "Perplexity", "NotebookLM", "Canva"],
  // Creator = q1 "building my brand right now", q2 "Lots of Ideas",
  // q5 "Build my online presence" or "Get my first client", q7 comfort ~3.
  // Needs: turn many ideas into consistent visuals + content + a repeatable system.
  "creator-persona-quiz": ["Leonardo.ai", "Canva", "Copy.ai", "n8n"],
  // Builder = q1 "launched but need better systems", q2 "Platform but No Clients",
  // q5 "Get my first client" or "Launch with confidence", q7 comfort ~4.
  // Needs: turn existing presence into leads/revenue — pipeline, content that
  // converts, and automation to stop manual follow-up.
  "builder-persona-quiz": ["HubSpot CRM", "Writesonic", "Zapier", "ChatGPT"],
  // Launcher = q1 "rebranding/pivoting", q2 "Grand Vision", q5 "Launch with
  // confidence" or "Grow what I've started", q7 comfort 5 (daily AI user).
  // Needs: speed and scale — automation, fast asset production, autonomous agents.
  "launcher-persona-quiz": ["n8n", "Kling AI", "v0 by Vercel", "Manus AI"],
};

/** Q6 "Where are you feeling stuck?" → the 1-2 tools that most directly fix that. */
const OBSTACLE_TOOLS: Record<string, string[]> = {
  choosing_tools: ["Claude"], // a thinking partner to talk through options, not a specific point tool
  knowing_where_to_start: ["Claude", "NotebookLM"],
  designing_visuals: ["Canva", "Leonardo.ai"],
  writing_business: ["Copy.ai", "Grammarly"],
  finding_niche: ["Perplexity"],
  marketing_content: ["Writesonic", "Zapier"],
  // full_kit intentionally has no direct mapping — handled as "use the persona default" below.
};

/** Q3 "What are you building?" → one extra tool worth adding if there's room. */
const BUSINESS_TYPE_BONUS: Record<string, string> = {
  product_based: "HubSpot CRM",
  coaching_service: "HubSpot CRM",
  content_creator: "Leonardo.ai",
  community_movement: "n8n",
};

export type PersonaAnswers = {
  obstacles?: string[]; // q6
  businessType?: string[]; // q3
  comfort?: number; // q7, 1-5
};

/**
 * Parse the compact query-string encoding PersonaQuiz.tsx links with
 * (?obstacles=a,b&business=c,d&comfort=3) back into PersonaAnswers.
 */
export function parsePersonaAnswers(
  sp: Record<string, string | string[] | undefined>
): PersonaAnswers {
  const toList = (v: string | string[] | undefined) =>
    !v ? undefined : (Array.isArray(v) ? v[0] : v).split(",").filter(Boolean);
  const comfortRaw = Array.isArray(sp.comfort) ? sp.comfort[0] : sp.comfort;
  return {
    obstacles: toList(sp.obstacles),
    businessType: toList(sp.business),
    comfort: comfortRaw ? Number(comfortRaw) : undefined,
  };
}

export function getPersonalizedKit(
  personaSlug: string,
  answers: PersonaAnswers
): { tools: string[]; note: string | null } {
  const base = PERSONA_KITS[personaSlug] ?? [];
  const { obstacles, businessType, comfort } = answers;

  // No real answers to personalize with — just show the persona default.
  if (!obstacles?.length && !businessType?.length) {
    return { tools: base, note: null };
  }

  const picked: string[] = [];
  const add = (name: string) => {
    if (!picked.includes(name)) picked.push(name);
  };

  const usedFullKit = obstacles?.includes("full_kit");
  if (!usedFullKit) {
    for (const obstacle of obstacles ?? []) {
      for (const tool of OBSTACLE_TOOLS[obstacle] ?? []) {
        if (picked.length >= 3) break;
        add(tool);
      }
    }
  }

  // One tool for their business type, if there's a slot and it's not already in.
  for (const type of businessType ?? []) {
    if (picked.length >= 4) break;
    const bonus = BUSINESS_TYPE_BONUS[type];
    if (bonus) add(bonus);
  }

  // Fill any remaining slots (or the whole kit, for "full_kit"/no obstacle match)
  // from the persona default, so the kit always lands on exactly 4 tools.
  for (const tool of base) {
    if (picked.length >= 4) break;
    add(tool);
  }

  const obstacleLabels: Record<string, string> = {
    choosing_tools: "choosing the right tools",
    knowing_where_to_start: "knowing where to start",
    designing_visuals: "designing visuals or branding",
    writing_business: "writing about your business",
    finding_niche: "finding your niche",
    marketing_content: "marketing & content",
    full_kit: "wanting the full kit",
  };
  const named = (obstacles ?? []).filter((o) => o !== "full_kit").map((o) => obstacleLabels[o]).filter(Boolean);
  let note: string | null = null;
  if (named.length) {
    const list =
      named.length === 1
        ? named[0]
        : `${named.slice(0, -1).join(", ")} and ${named[named.length - 1]}`;
    note = `Based on your quiz answers — you told us you're mainly stuck on ${list} — here's what to use first.`;
  } else if (usedFullKit) {
    note = "You told us you just need the full kit — here's your complete starter set.";
  }
  if (comfort !== undefined && comfort <= 2) {
    note = (note ?? "") + " These are picked to have the gentlest learning curve since you're new to AI tools.";
  }

  return { tools: picked.slice(0, 4), note };
}
