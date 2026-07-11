# AGENTS.md — BrandBizkit agent contract

This site is agent-native. AI agents (and this repo's own automation) interact with it in two ways:

## 1. Reading (no auth)

- `GET /llms.txt` — site overview + link index (llmstxt.org format)
- `GET /llms-full.txt` — full site content as one markdown document
- `GET /<slug>.md` — markdown mirror of any page (`/index.md` for the homepage)
- `GET /services.md` — machine-readable service catalog
- `GET /sitemap.xml`, `GET /feed.xml`

## 2. Writing (requires `x-api-key: <AGENT_API_KEY>`)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/agent/content` | GET | Inventory of all published content |
| `/api/agent/content` | POST | Create/update a blog post: `{slug, title, description, body, date?, author?, image?, videos?}` |
| `/api/agent/videos` | POST | Add/update a video, attach a transcript: `{id, transcript?, title?, description?, pages?}` |
| `/api/agent/mentions` | POST | Log an external brand mention: `{title, url, source, type?, date?, quote?}` |
| `/api/agent/tools-directory` | GET/POST | Read or update the free-AI-tools directory. POST `{categories:[...]}` replaces; `{merge:true, categories:[...]}` upserts tools by name. `updatedAt` is set automatically |

Every write is logged to the CRM event log (visible at `/admin`) and lands as a file
change in `content/`, so agent publishes are git-reviewable.

## Editing conventions for coding agents

- Content lives in `content/` — never hardcode copy into components when it belongs in a collection.
- New pages inherit schema, sitemap, llms.txt, and `.md` mirrors automatically from their collection; do not write manual JSON-LD.
- Design tokens are in `app/globals.css` (`@theme`): brand accent `#e44a29`, dark `#0d141a`, fonts Poppins (display) / Inter (body).
- URLs must stay stable — they match the original live site for SEO continuity. Add redirects in `next.config.ts` if a slug ever changes.
- Videos must always have transcripts (`content/videos.json`) — AI engines use them to recommend videos.

## Active automated pipelines

- **Weekly free-AI-tools refresh** — scheduled task `weekly-free-ai-tools-update` (Fridays 16:00 local, managed in Claude Code's Scheduled section) researches the most popular free / free-credit AI tools per category and rewrites `content/tools-directory.json` following `scripts/weekly-tools-update.md`. The five tools pages, their ItemList schema, markdown mirrors, and llms.txt all regenerate from that file automatically.
- **Every-other-day Bizkit Insights drafts** — scheduled task `bizkit-insights-article-draft` (9:00 AM every 2 days) researches current AI news for SMBs/entrepreneurs (≈2 global : 1 Philippines-focused) and writes an article draft to `content/drafts/` following `scripts/insights-article-playbook.md`. Authors alternate between Karla Kangleon and Michael Nielsen. **Drafts never auto-publish**: the owner previews and approves/rejects them at `/admin` (publish stamps today's date and moves the file to `content/posts/`, instantly joining the blog, sitemap, RSS, llms.txt and `.md` mirrors). Charts are data in frontmatter (`charts:` + `[chart:N]` body markers) rendered as brand SVG on-page and as markdown tables in the agent-readable mirrors.

## CRM / lead capture

Leads and newsletter subscribers live in **Supabase** (Postgres), not SQLite — see
`lib/supabase.ts` + `supabase/schema.sql`. Run the schema once in the Supabase SQL
Editor, then set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` in `.env`. Both tables
have RLS enabled with zero public policies — every read/write goes through our own
API routes using the service role key server-side; the key must never reach the
browser. The internal agent/admin `events` log stays on local SQLite (low-stakes,
not customer data — doesn't need to survive a deploy).

Touch-points feeding Supabase, each tagged with a `source` for attribution:
- `LeadForm` (the "Let's Talk" contact form in `ServicesTail`, on every page) → `/api/leads` → `leads` table
- `AiSchoolLeadForm` (`/ai-school`, `source: "ai-school"`) → `/api/leads` — also captures `experience_level` (none | some | experienced) and a required `consent` boolean (enforced server-side); columns added by `supabase/migrations/002_ai_school_lead_fields.sql`
- `NewsletterSignup` (footer, `source: "footer"`) → `/api/subscribe` → `newsletter_subscribers`
- `ScrollSignupPopup` (sitewide, once ever, `source: "popup_scroll"`) — fires the first time a visitor scrolls ~2–3 sections on any page; gated by `localStorage.bb_popup_scroll_shown`
- `InsightsExitPopup` (Bizkit Insights pages only, `source: "popup_exit_insights"`) — fires on exit-intent (mouse leaves via the top edge), re-arms every browser session via `sessionStorage.bb_popup_insights_shown`
- Once anyone subscribes anywhere, `localStorage.bb_subscribed` suppresses all future popups.

## Planned pipeline extensions (scaffolding in place)

- **Automated publishing**: cron/scheduled agent → `POST /api/agent/content` → deploy hook.
- **Automated emails**: new leads/subscribers land in Supabase + forward to GoHighLevel workflows (`GHL_WEBHOOK_URL` or `GHL_API_KEY`+`GHL_LOCATION_ID`), which handle sends today; a native sender can replace GHL later.
- **Agentic marketing**: daily agent run reads `/admin` event log + analytics, refreshes stale posts (`updated` frontmatter), logs new mentions, and fills missing transcripts.
