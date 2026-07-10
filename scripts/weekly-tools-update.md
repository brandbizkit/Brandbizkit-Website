# Weekly Free-AI-Tools Directory Update

You are the automated research agent for brandbizkit.com. Your job: refresh the
free-AI-tools directory at `content/tools-directory.json` with the most popular
**completely free** or **free-with-limited-credits** AI tools right now.

## Procedure

1. Read `content/tools-directory.json` to see the current categories and tools.
2. For EACH category, run web searches for the current month/year, e.g.:
   - "best free AI image generators <month> <year> free credits"
   - "best free AI video generators <month> <year> free tier"
   - "best free no-code AI app builders <month> <year>"
   - "best free AI agent automation tools <month> <year>"
   - "best free AI design tools <month> <year>"
   - "best free AI voice transcription text to speech <month> <year>"
   - "best free AI tools for entrepreneurs <month> <year>"
3. Cross-check at least 2 sources per change. For every tool decide:
   - KEEP (still popular, free tier unchanged) → update `lastVerified` only if re-confirmed
   - UPDATE (free tier changed — new credit amounts, new pricing) → fix `freeDetails`/`why`
   - REMOVE (discontinued, no longer has a meaningful free tier, or fell out of relevance)
   - ADD (new popular tool with a genuine free tier) → append with today's `lastVerified`
4. Rules for entries:
   - `why` is one sentence explaining why the tool is recommended (specific, no fluff)
   - `pricing`: "free" (completely free/open source), "free-credits" (limited daily/monthly credits), "freemium" (free plan of a paid product)
   - `freeDetails` states the exact free allowance (e.g. "66 credits/day")
   - No fixed cap on tools per category — include every genuinely useful, currently-relevant free/free-credit tool you can verify, ordered best-first. Don't pad with weak or redundant entries just to grow the list, but don't trim good tools just to hit an old target count either.
   - Actively look for tools from a wide range of developers/companies, not just the usual suspects — check Google Labs/AI Studio and other major-lab free offerings each run, since they ship new free tools frequently.
   - If a tool's free tier or availability varies by country (e.g. Google Labs betas, regional credit differences), say so explicitly in `why` and/or `freeDetails` — still include the tool, just flag the caveat.
5. Write the updated file (keep the same JSON shape), set `updatedAt` to today
   and `updateNote` to a one-line summary of what changed.
6. Verify: run `npx tsc --noEmit` in the project root, then `curl -s http://localhost:3000/free-ai-tools | grep -o "Last updated: [0-9-]*"` if the dev server is running (skip if not). Note: the year-suffixed tools URLs (e.g. /top-free-ai-tools-<current year>) roll forward automatically every January — content files live under year-less base slugs in content/pages/ and must stay that way.
7. Finish with a short changelog: tools added, removed, and updated.

Do NOT touch any other file. Do NOT run `next build` if a dev server is running.
Project root: /Users/michaelnnielsen/Documents/Claude Code/Brandbizkit
