"use client";

/**
 * BrandBizkit Persona Quiz — faithful rebuild of the original embedded widget.
 *
 * Questions, scoring matrix, special Q6 logic, tie-break order
 * (Dreamer > Creator > Builder > Launcher) and persona routing are ported 1:1
 * from the live site's custom-code block. Improvement over the original:
 * scores are recomputed from answers on every step, so going back and changing
 * an answer no longer double-counts points.
 */
import { useMemo, useState } from "react";
import Link from "next/link";

type PersonaName = "Dreamer" | "Creator" | "Builder" | "Launcher";
type Scores = Record<PersonaName, number>;

type Question = {
  id: string;
  question: string;
  type: "single" | "multiple" | "scale";
  options: { text: string; value: string | number }[];
  logic: Record<string, Partial<Scores>>;
  special?: boolean;
  optional?: boolean;
};

const QUESTIONS: Question[] = [
  {
    id: "q1",
    question: "What best describes your current business stage?",
    type: "single",
    options: [
      { text: "I have an idea but haven’t started", value: "idea_not_started" },
      { text: "I’m building my brand right now", value: "building_brand" },
      { text: "I already launched but need better systems", value: "launched_need_systems" },
      { text: "I’m rebranding or pivoting", value: "rebranding_pivoting" },
      { text: "Just curious for now", value: "just_curious" },
    ],
    logic: {
      idea_not_started: { Dreamer: 2 },
      building_brand: { Creator: 2 },
      launched_need_systems: { Builder: 2 },
      rebranding_pivoting: { Launcher: 1 },
      just_curious: { Dreamer: 1 },
    },
  },
  {
    id: "q2",
    question: "Which of these describes you best?",
    type: "single",
    options: [
      { text: "💡 Blank Canvas", value: "blank_canvas" },
      { text: "🧭 Grand Vision", value: "grand_vision" },
      { text: "🔀 Lots of Ideas", value: "lots_of_ideas" },
      { text: "📣 Platform but No Clients", value: "platform_no_clients" },
    ],
    logic: {
      blank_canvas: { Dreamer: 3 },
      grand_vision: { Launcher: 3 },
      lots_of_ideas: { Creator: 3 },
      platform_no_clients: { Builder: 3 },
    },
  },
  {
    id: "q3",
    question: "What are you building or branding?",
    type: "multiple",
    options: [
      { text: "Product-based business", value: "product_based" },
      { text: "Coaching or service-based offer", value: "coaching_service" },
      { text: "Content creator/personal brand", value: "content_creator" },
      { text: "Community or movement", value: "community_movement" },
      { text: "Not sure yet", value: "not_sure" },
    ],
    logic: {},
  },
  {
    id: "q4",
    question: "What vibe fits your brand best? (Pick up to 2)",
    type: "multiple",
    optional: true,
    options: [
      { text: "Bold & Disruptive", value: "bold_disruptive" },
      { text: "Minimal & Modern", value: "minimal_modern" },
      { text: "Fun & Friendly", value: "fun_friendly" },
      { text: "Elegant & Premium", value: "elegant_premium" },
      { text: "Quirky & Creative", value: "quirky_creative" },
      { text: "Grounded & Helpful", value: "grounded_helpful" },
    ],
    logic: {},
  },
  {
    id: "q5",
    question: "What’s your #1 priority right now?",
    type: "single",
    options: [
      { text: "Create my brand identity", value: "create_identity" },
      { text: "Validate my idea", value: "validate_idea" },
      { text: "Build my online presence", value: "build_online_presence" },
      { text: "Get my first paying client", value: "get_first_client" },
      { text: "Launch with confidence", value: "launch_confidence" },
      { text: "Grow what I’ve started", value: "grow_started" },
    ],
    logic: {
      create_identity: { Dreamer: 2 },
      validate_idea: { Dreamer: 2 },
      build_online_presence: { Creator: 2 },
      get_first_client: { Creator: 2, Builder: 2 },
      launch_confidence: { Builder: 2, Launcher: 2 },
      grow_started: { Launcher: 2 },
    },
  },
  {
    id: "q6",
    question: "Where are you feeling stuck or overwhelmed? (Pick all that apply)",
    type: "multiple",
    special: true,
    options: [
      { text: "Choosing the right tools", value: "choosing_tools" },
      { text: "Knowing where to start", value: "knowing_where_to_start" },
      { text: "Designing visuals or branding", value: "designing_visuals" },
      { text: "Writing about my business", value: "writing_business" },
      { text: "Finding my niche", value: "finding_niche" },
      { text: "Marketing & content", value: "marketing_content" },
      { text: "I just need a full kit", value: "full_kit" },
    ],
    logic: {},
  },
  {
    id: "q7",
    question: "How comfortable are you with using AI tools (ChatGPT, Canva, etc.)?",
    type: "scale",
    options: [
      { text: "1 = I’ve never used them", value: 1 },
      { text: "2", value: 2 },
      { text: "3", value: 3 },
      { text: "4", value: 4 },
      { text: "5 = I use them daily", value: 5 },
    ],
    logic: {
      "1": { Dreamer: 1 },
      "2": { Dreamer: 1 },
      "3": { Creator: 1 },
      "4": { Builder: 1 },
      "5": { Launcher: 1 },
    },
  },
];

// Ordered by beginner-friendliness for tie-breaking (original behavior)
const PERSONAS: {
  name: PersonaName;
  badge: string;
  panel: string;
  description: string;
  output: string;
  url: string;
}[] = [
  {
    name: "Dreamer",
    badge: "bg-blue-500",
    panel: "bg-blue-500/10",
    description: "Idea-stage, unsure, needs direction and tools",
    output:
      "AI toolkit, a few starter prompts and your action plan + access to many other free tools to help you on your journey",
    url: "/dreamer-persona-quiz",
  },
  {
    name: "Creator",
    badge: "bg-purple-500",
    panel: "bg-purple-500/10",
    description: "Creative, multi-idea, needs systems and visuals",
    output:
      "AI toolkit, a few starter prompts and your action plan + access to many other free tools to help you on your journey",
    url: "/creator-persona-quiz",
  },
  {
    name: "Builder",
    badge: "bg-red-500",
    panel: "bg-red-500/10",
    description: "Already has something, needs marketing and monetization",
    output:
      "AI toolkit, a few starter prompts and your action plan + access to many other free tools to help you on your journey",
    url: "/builder-persona-quiz",
  },
  {
    name: "Launcher",
    badge: "bg-yellow-500",
    panel: "bg-yellow-500/10",
    description: "Clear on what they want, ready to execute and scale",
    output:
      "AI toolkit, a few starter prompts and your action plan + access to many other free tools to help you on your journey",
    url: "/launcher-persona-quiz",
  },
];

type Answers = Record<string, string | string[] | number>;

function scoreQuiz(answers: Answers): Scores {
  const scores: Scores = { Dreamer: 0, Creator: 0, Builder: 0, Launcher: 0 };
  for (const q of QUESTIONS) {
    const a = answers[q.id];
    if (a === undefined) continue;
    if (q.special) {
      const sel = a as string[];
      if (sel.includes("knowing_where_to_start") || sel.includes("finding_niche")) scores.Dreamer += 2;
      if (sel.includes("designing_visuals") || sel.includes("writing_business")) scores.Creator += 2;
      if (sel.includes("marketing_content")) scores.Builder += 2;
      if (sel.includes("full_kit")) {
        scores.Dreamer += 1; scores.Creator += 1; scores.Builder += 1; scores.Launcher += 1;
      }
      if (sel.length > 4) scores.Creator += 1;
    } else if (q.type === "single" || q.type === "scale") {
      const points = q.logic[String(a)];
      if (points) for (const [p, n] of Object.entries(points)) scores[p as PersonaName] += n!;
    }
  }
  return scores;
}

/**
 * Carries the visitor's actual Q3/Q6/Q7 answers to the result page as a
 * compact query string, so the "Brand Launch Kit" there can recommend tools
 * for their specific obstacles/business type instead of just the persona
 * default. See lib/persona-kits.ts (parsePersonaAnswers / getPersonalizedKit).
 */
function buildResultUrl(baseUrl: string, answers: Answers): string {
  const params = new URLSearchParams();
  const obstacles = answers.q6 as string[] | undefined;
  const business = answers.q3 as string[] | undefined;
  const comfort = answers.q7 as number | undefined;
  if (obstacles?.length) params.set("obstacles", obstacles.join(","));
  if (business?.length) params.set("business", business.join(","));
  if (comfort !== undefined) params.set("comfort", String(comfort));
  const qs = params.toString();
  return qs ? `${baseUrl}?${qs}` : baseUrl;
}

function calculatePersona(scores: Scores) {
  let max = -1;
  let assigned = PERSONAS[0];
  for (const p of PERSONAS) {
    if (scores[p.name] > max) {
      max = scores[p.name];
      assigned = p;
    }
    // ties keep the earlier (more beginner-friendly) persona — original behavior
  }
  return assigned;
}

export default function PersonaQuiz() {
  const [screen, setScreen] = useState<"start" | "intro" | "quiz" | "results">("start");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState(false);

  const q = QUESTIONS[index];
  const persona = useMemo(() => calculatePersona(scoreQuiz(answers)), [answers]);

  function setAnswer(value: string | string[] | number) {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
    setError(false);
  }

  function toggleMulti(value: string) {
    const cur = (answers[q.id] as string[]) ?? [];
    setAnswer(cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]);
  }

  function next() {
    const a = answers[q.id];
    const empty =
      a === undefined || (Array.isArray(a) && a.length === 0 && !q.optional);
    if (q.type === "scale" && a === undefined) {
      setAnswer(3); // original defaults slider to the middle
    } else if (empty && q.type !== "scale") {
      setError(true);
      return;
    }
    if (index < QUESTIONS.length - 1) setIndex(index + 1);
    else setScreen("results");
  }

  function restart() {
    setAnswers({});
    setIndex(0);
    setScreen("start");
  }

  const card =
    "mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 text-center shadow-[0_24px_60px_rgb(13_20_26/0.18)] md:p-12";
  const orangeBtn = "btn btn-quiz px-8 font-bold";

  if (screen === "start") {
    return (
      <div className={card}>
        <h3 className="font-display text-3xl font-bold text-brand-ink">
          brandbizkit Persona Quiz
        </h3>
        <p className="mt-4 text-lg text-brand-text/75">
          If you need some inspiration and guidance take the brandbizkit Persona Quiz below
        </p>
        <button className={`mt-6 ${orangeBtn} text-xl`} onClick={() => setScreen("intro")}>
          Begin Quiz
        </button>
      </div>
    );
  }

  if (screen === "intro") {
    return (
      <div className={card}>
        <h3 className="font-display text-3xl font-bold text-brand-ink">
          brandbizkit Persona Quiz
        </h3>
        <p className="mt-4 text-xl font-semibold text-brand-ink">
          ✨ Hey future founder, ready to build something bold?
        </p>
        <p className="mt-4 text-brand-text/75">
          This isn’t your typical quiz — the <strong>brandbizkit Persona quiz</strong> is your
          shortcut to curated tools, templates, and prompts that match your vibe, your vision,
          and your level (whether you&apos;re starting from scratch or scaling with style).
        </p>
        <p className="mt-3 text-brand-text/75">
          Just answer a few real-talk questions. In less than 3 minutes, you&apos;ll unlock your{" "}
          <strong className="text-brand-orange">AI-powered Brand Launch Kit</strong> to get you
          started building your business with AI today!
        </p>
        <button className={`mt-6 ${orangeBtn} text-xl`} onClick={() => setScreen("quiz")}>
          Ready? Let’s kit your biz.👇
        </button>
      </div>
    );
  }

  if (screen === "results") {
    return (
      <div className={card}>
        <h3 className="font-display text-3xl font-bold text-brand-ink md:text-4xl">
          Your brandbizkit persona:
        </h3>
        <div className={`mt-6 rounded-lg p-6 shadow-inner ${persona.panel}`}>
          <p
            className={`inline-block rounded-lg ${persona.badge} p-2 px-4 font-display text-4xl font-extrabold text-white`}
          >
            {persona.name}
          </p>
          <p className="mt-4 text-lg text-brand-text/80">{persona.description}</p>
          <p className="mt-3 text-brand-text/60">Your unique roadmap includes:</p>
          <p className="mt-1 font-medium text-brand-ink">{persona.output}</p>
        </div>
        <p className="mt-6 text-brand-text/75">If you would like to know more — click here</p>
        <div className="mt-4 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href={buildResultUrl(persona.url, answers)} className={orangeBtn}>
            YES, I&apos;M INTERESTED
          </Link>
          <button
            onClick={restart}
            className="btn bg-brand-light font-bold text-brand-ink hover:bg-brand-ink hover:text-white"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  // quiz screen
  const a = answers[q.id];
  return (
    <div className={card}>
      <h3 className="font-display text-2xl font-semibold text-brand-ink">
        Question {index + 1} of {QUESTIONS.length}
      </h3>
      <p className="mt-3 text-xl text-brand-text md:text-2xl">{q.question}</p>

      <div className="mx-auto mt-8 flex max-w-md flex-col items-stretch gap-3">
        {q.type === "single" &&
          q.options.map((o) => (
            <label
              key={String(o.value)}
              className={`flex cursor-pointer items-center rounded-lg border p-4 text-left transition ${
                a === o.value
                  ? "border-brand-orange bg-brand-cream"
                  : "border-brand-ink/15 hover:bg-brand-light"
              }`}
            >
              <input
                type="radio"
                name={q.id}
                checked={a === o.value}
                onChange={() => setAnswer(o.value as string)}
                className="h-5 w-5 accent-[#FF5733]"
              />
              <span className="ml-3 text-lg text-brand-text">{o.text}</span>
            </label>
          ))}

        {q.type === "multiple" &&
          q.options.map((o) => {
            const sel = ((a as string[]) ?? []).includes(o.value as string);
            return (
              <label
                key={String(o.value)}
                className={`flex cursor-pointer items-center rounded-lg border p-4 text-left transition ${
                  sel ? "border-brand-orange bg-brand-cream" : "border-brand-ink/15 hover:bg-brand-light"
                }`}
              >
                <input
                  type="checkbox"
                  checked={sel}
                  onChange={() => toggleMulti(o.value as string)}
                  className="h-5 w-5 rounded accent-[#FF5733]"
                />
                <span className="ml-3 text-lg text-brand-text">{o.text}</span>
              </label>
            );
          })}

        {q.type === "scale" && (
          <div className="px-2">
            <input
              type="range"
              min={1}
              max={5}
              value={(a as number) ?? 3}
              onChange={(e) => setAnswer(Number(e.target.value))}
              className="bb-slider w-full"
              aria-label={q.question}
            />
            <div className="mt-2 flex justify-between text-sm text-brand-text/60">
              {q.options.map((o) => (
                <span key={String(o.value)}>{o.text}</span>
              ))}
            </div>
            <p className="mt-4 text-brand-text/75">
              Current value: <strong>{(a as number) ?? 3}</strong>
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 text-brand-accent">Please select an answer to proceed.</p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => index > 0 && setIndex(index - 1)}
          className={`btn bg-brand-light px-6 py-2 font-bold text-brand-ink hover:bg-brand-ink/15 ${
            index === 0 ? "invisible" : ""
          }`}
        >
          Previous
        </button>
        <button onClick={next} className="btn btn-quiz px-6 py-2 font-bold">
          {index === QUESTIONS.length - 1 ? "See Results" : "Next"}
        </button>
      </div>
    </div>
  );
}
