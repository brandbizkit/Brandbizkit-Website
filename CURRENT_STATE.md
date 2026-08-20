# BrandBizkit — Current State

_Last updated: 2026-08-20. This is a snapshot, not a log — overwrite it, don't append to it._

## What's currently working
- Full front-end site (33 pages), persona quiz, design system — verified against the original live site.
- Supabase CRM: `leads`, `newsletter_subscribers`, and (as of today) `events` tables — all confirmed working end-to-end in production Supabase (writes/reads tested, `/admin` loads cleanly).
- `/admin` Command Center: drafts queue, leads/subscribers tables, content inventory, event log, and a new "🆕 Newly added free AI tools" digest section.
- Growth Score funnel (`/growth-score`) — full 14-question flow, scoring, dashboard, Supabase lead capture. Linked from both the homepage hero (`>>Start<<` button) and the "Start your business, stress free" services section.
- Free AI Tools directory — every tool (74 total) now shows free-tier limits, an explicit paid-plan pricing line, and (where relevant) a ⚠️ access warning for tools requiring self-hosting/technical setup/bring-your-own-API-key.
- Supabase keepalive: GitHub Actions workflow (`.github/workflows/supabase-keepalive.yml`) pinging the DB every 3 days, confirmed running.
- GitHub repo (`brandbizkit/Brandbizkit-Website`) is public; history was rewritten once (`git filter-branch`) to strip two SQLite WAL files carrying a leftover test lead row before going public. Old refs preserved locally on branch `backup-pre-history-rewrite` and `rewritten-history-attempt` in case they're ever needed.

## Current architecture
See `PROJECT_PLAN.md` for the full architecture. Nothing has diverged from that plan.

## Important implementation decisions made this session
- Internal admin/agent event log moved from local SQLite (`lib/db.ts` + `better-sqlite3`) to a Supabase `events` table, because serverless hosts (Netlify/Vercel) have a read-only filesystem at runtime and the old code would have silently broken lead-capture on every request. `better-sqlite3` dependency removed entirely.
- Free-tools directory pricing model expanded: added `paidPlan` (researched current pricing) and `access` (only set when free access requires self-hosting or a technical setup) fields to `DirectoryTool` in `lib/tools-directory.ts`, rendered in both `/admin` and the public tool cards (`components/ToolsDirectory.tsx`).
- Chose Netlify over Vercel as the hosting target — same GitHub-connect/auto-deploy workflow, zero code changes needed (unlike Cloudflare Pages, which needs an edge adapter for Next.js).

## Known issues / things to double-check
- **A leftover test lead is still in Supabase**: `leads` table, name "BizKit", email `brandbizkits@gmail.com`, dated 2026-07-11 — created while verifying the Growth Score funnel during development, never real customer data. Should be deleted (Supabase → Table Editor → `leads`) — not yet confirmed done.
- **Some paid-plan prices are estimates, not confirmed**: TTSMaker's exact Pro price wasn't published anywhere findable (flagged inline in the content — check `pro.ttsmaker.com/pricing` before quoting a number to anyone). Boomy and Writesonic pricing sources disagreed with each other; current entries note that and point to the vendor's own pricing page.
- **Video transcripts and social profile URLs** in the content are still placeholders/best-guesses from the original migration — need the owner to confirm real values (per the standing migration memory note, not yet resolved).
- **Local network on this machine is occasionally unreliable** for large data transfers — two `git push` attempts stalled/timed out before succeeding (once via HTTPS retry, once by switching from a hung SSH attempt back to HTTPS). Not a code issue; just worth trying again / switching transport if a push hangs.

## Unfinished MVP items
- **Hosting migration is mid-flight, not done.** Decision made (Netlify), but no Netlify account/project has been created yet, no GitHub connection made, no DNS repointed at Hostinger. This is the active next task.
- No automated email is sent to leads/subscribers anywhere (by design, see Project Plan's excluded list) — if that's ever wanted, it's new scope, not a bug.

## Important files/components
- `lib/db.ts` — CRM datastore (Supabase-backed: leads, subscribers, events).
- `lib/supabase.ts` — server-only Supabase admin client.
- `lib/tools-directory.ts` + `content/tools-directory.json` — free-tools directory data/types.
- `components/ToolsDirectory.tsx` — public tool-card rendering.
- `components/GrowthScore.tsx` + `content/growth-score.json` — the assessment funnel.
- `app/admin/page.tsx` — the internal Command Center.
- `.github/workflows/supabase-keepalive.yml` — DB keepalive automation.
- `AGENTS.md` — serves the role of this project's `CLAUDE.md` (agent/coding-agent contract); read it alongside this file and `PROJECT_PLAN.md`.

## Current next priorities
1. Set up Netlify: connect GitHub, deploy, set environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_KEY`, `AGENT_API_KEY`), verify the deployed site works end-to-end (lead forms, `/admin`, Growth Score).
2. Point `brandbizkit.com`'s DNS (at Hostinger) to the Netlify deployment.
3. Delete the leftover test lead from Supabase.
4. Confirm/replace placeholder video transcripts and social URLs.
5. Commit and push the current uncommitted work (Supabase event-log migration + tools-directory pricing clarity, commit `827c144`) — **already committed locally, not yet pushed to GitHub.**
