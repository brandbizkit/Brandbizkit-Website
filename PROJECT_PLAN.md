# BrandBizkit — Project Plan

## Objective
Migrate brandbizkit.com off GoHighLevel/Hostinger's site builder into a fully owned Next.js codebase — "digital sovereignty" over the front end, an agent-native GEO/SEO layer, and a custom CMS/CRM backend with agentic marketing pipelines (article research, tool-directory refresh, lead capture).

## Target user
Aspiring entrepreneurs and small-business owners looking for free/low-cost AI tools, done-for-you brand starter kits, and AI education — the brandbizkit.com visitor, not an internal admin (the `/admin` panel is Michael/Karla only).

## MVP scope
- 1:1 front-end parity with the original 33-page live site (design tokens, copy, URLs) — URLs are frozen for SEO continuity; any slug change needs a redirect in `next.config.ts`.
- Content-as-files CMS (`content/*.json`, `content/posts/*.md`) as the single source of truth, no external CMS.
- Supabase-backed CRM for leads and newsletter subscribers, replacing GHL as the primary data store (GHL kept as an optional parallel forward-sync).
- Agent-native surface: `llms.txt`, `llms-full.txt`, per-page `.md` mirrors, JSON-LD schema — so AI search/agents can read and (via `x-api-key`) write content.
- Human-in-the-loop publishing: scheduled research agents draft articles/tool-directory updates; a person approves via `/admin` before anything goes live.

## User journey
1. Visitor lands on a page (home, tools directory, an insights article, or a persona quiz).
2. Free-tool pages and articles pull them toward a conversion moment: newsletter popup, the Growth Score funnel (`/growth-score`), or a lead form (`ServicesTail`, AI School).
3. Lead/subscriber lands in Supabase, tagged by `source` for attribution.
4. Owner reviews leads and pending article drafts in `/admin`, publishes or rejects.

## Technical architecture
- Next.js 15 (App Router) + React 19 + TypeScript, Tailwind v4 design system in `app/globals.css`.
- Content-as-files: `lib/content.ts` reads `content/*.json` + `content/posts/*.md` (gray-matter frontmatter).
- Supabase (Postgres) as the CRM/event-log backend — server-only via `lib/supabase.ts` + `SUPABASE_SERVICE_ROLE_KEY`, RLS enabled with zero public policies (every read/write goes through our own API routes, never the browser directly).
- Middleware rewrites `*.md` URLs to markdown mirrors for AI crawlers.
- Admin auth is a single shared `ADMIN_KEY` cookie, not a user system — appropriate for a 2-person team, not multi-user.
- Hosting target: currently local-only; actively deciding between Netlify/Vercel-style hosting (needed because the app has live API routes, not just static pages) with the `brandbizkit.com` domain's DNS repointed there, while keeping domain registration at Hostinger. Hostinger's own hosting can't run this app on the current plan (Website Builder product, no Node.js support) — see Current State for where this stands.

## Database / data structure
- Supabase `leads` table: name, email, phone, message, source, page_path, experience_level, consent, synced_to_ghl, created_at. RLS locked down, service-role only.
- Supabase `newsletter_subscribers` table: email (unique), name, source, page_path, created_at.
- Supabase `events` table (migration `003_events_table.sql`): internal admin/agent event log — type, actor, payload (jsonb), created_at. Replaces an earlier local-SQLite version that didn't survive serverless deploys.
- `content/tools-directory.json`: categorized free/free-credit AI tools, each with `pricing`, `freeDetails`, `paidPlan`, optional `access` (flags self-hosted/technical-setup-required tools) and `addedOn`.
- `content/growth-score.json`: 14-question assessment funnel config (dimensions, grading bands, kit recommendations).
- `content/pricing.json`: 3-tier service ladder (Starter/Launch/Growth Kit).

## Key features
- Persona quiz (`components/PersonaQuiz.tsx`) — ported 1:1 from the original site's scoring logic.
- Growth Score funnel (`/growth-score`) — ScoreApp-style assessment, dashboard results, email-gated, Supabase lead capture.
- Free AI Tools directory (`/top-free-ai-tools-*`) — weekly-refreshed, every tool shows free-tier limits, paid-plan pricing, and an explicit access-method warning when "free" isn't as simple as visiting a website.
- Bizkit Insights article pipeline — scheduled research agent drafts, human approval in `/admin`, auto-generated charts from frontmatter data.
- `/admin` Command Center — drafts queue, leads/subscribers tables, content inventory, newly-added-tools digest, event log.
- Lead capture touch-points: `ServicesTail` contact form, AI School form (with required consent), footer newsletter signup, scroll and exit-intent popups.
- Supabase keepalive — GitHub Actions workflow pinging the DB every 3 days so the free-tier project doesn't auto-pause.

## UI/UX requirements
- Light-themed design system matching the original crawled site (not dark, an earlier assumption that was corrected): white header, `#0d141a` text, periwinkle `#697BDC` buttons, yellow `#F3C82E` hero CTA, accent red-orange `#e44a29`/`#FF4232`, Poppins (display) / Inter (body).
- Reusable classes in `app/globals.css` `@layer components` (`.btn`, `.card`, `.section-*`) — new UI should use these, not ad-hoc Tailwind strings.
- Popups must respect `localStorage`/`sessionStorage` suppression so a subscribed visitor never gets re-prompted.

## Implementation order (as actually executed)
1. Crawl + rebuild the live site 1:1 (front end, design system, content extraction).
2. Add agent-native GEO layer (schema, llms.txt, markdown mirrors) and the CMS/publishing pipeline.
3. Wire Supabase CRM, replacing/augmenting GHL; wire all lead-capture touch-points and popups.
4. Rebuild pricing into a 3-tier stage ladder; build the Growth Score funnel; link both from the homepage hero and services section.
5. Commit and push to GitHub (`brandbizkit/Brandbizkit-Website`), add Supabase keepalive automation.
6. Audit and fix content accuracy in the free-tools directory (paid-plan pricing, honest "what free actually requires" labeling).
7. *(in progress)* Choose and set up real hosting (Netlify), connect GitHub for auto-deploy, point the `brandbizkit.com` domain at it.

## Important constraints
- `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_KEY`, `AGENT_API_KEY`, and any GitHub PAT must never be committed to the repo or left in tracked git config — `.env` is gitignored and has never been committed (verified against full git history).
- URLs must not change without a redirect — SEO continuity from the original live site is a hard requirement.
- The site must survive a serverless deploy (Netlify/Vercel-style read-only filesystem) — nothing may depend on writing to local disk at runtime; this is why the event log moved from SQLite to Supabase.

## Decisions already made
- Supabase over a self-hosted DB or GHL-only — RLS-locked, service-role-only access pattern.
- Netlify preferred over Vercel/Cloudflare Pages for the eventual host — same GitHub-connect workflow as Vercel with zero code changes, unlike Cloudflare Pages which needs an edge adapter.
- Repo is public on GitHub (history was rewritten once to strip a stray test-data commit before flipping visibility).
- Pricing ladder is 3 tiers (Starter/Launch/Growth), not more — laddered by business stage, not by feature checklist.

## Explicitly excluded from MVP
- Multi-user admin auth (single shared key is enough for a 2-person team).
- Automated email sending to leads (no transactional email step exists yet — Growth Score and other forms save to Supabase only).
- A native email/SMS sender replacing GHL (still just a scaffold — see AGENTS.md "Planned pipeline extensions").
- Video transcripts and social profile URLs — some are still placeholders/guessed and need owner confirmation (see Current State).

## Definition of done (for the hosting migration currently in progress)
- `brandbizkit.com` resolves to the Netlify-hosted app (or equivalent), API routes and Supabase-backed features work in production, and Hostinger continues to handle only domain registration/DNS.
