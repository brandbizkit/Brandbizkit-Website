# BrandBizkit — Digital Home

The owned, platform-independent codebase for [brandbizkit.com](https://brandbizkit.com): a
Next.js front end replicated from the original site, plus a built-in CMS, CRM, and
agent-publishing API. Migrated off GoHighLevel/Hostinger for full digital sovereignty.

## Quick start

```bash
cp .env.example .env   # set ADMIN_KEY + AGENT_API_KEY
npm install
npm run dev            # http://localhost:3000
```

## What's inside

| Layer | Where | What it does |
|---|---|---|
| Front end | `app/`, `components/` | All 33 original pages at their original URLs, dark Poppins/Inter design system, hero video, lead forms |
| Content (CMS source of truth) | `content/` | Pages, posts, tools, videos, mentions as files — every edit is a git-reviewable change |
| Automated schema | `lib/schema.ts` | JSON-LD (Organization, WebSite, BlogPosting, FAQPage, ItemList, VideoObject, Breadcrumbs) generated per page from content. Zero manual schema work |
| GEO / AI-search layer | `lib/llm.ts`, `middleware.ts` | `/llms.txt`, `/llms-full.txt`, `/services.md`, per-page markdown mirrors (`/<slug>.md`), AI-crawler-friendly `robots.txt`, auto sitemap, RSS |
| Video + transcripts | `content/videos.json` | Every video renders with an on-page transcript and VideoObject schema so AI engines can recommend specific videos |
| CRM | `lib/db.ts` (SQLite in `data/`) | Leads + subscribers captured on-site; optional forwarding to GoHighLevel (`lib/ghl.ts`) so existing automations keep working |
| Admin CMS | `/admin` | Command center: leads, subscribers, content inventory, agent event log (`ADMIN_KEY`) |
| Agent API | `/api/agent/*` | Authenticated write surface for AI agents: publish posts, attach video transcripts, log brand mentions (`AGENT_API_KEY`) |

## Publishing content

**By hand:** drop a markdown file in `content/posts/` with frontmatter
(`title, description, date, author, image`). Done — page, schema, sitemap entry,
llms.txt entry, RSS item, and `.md` mirror all ship automatically.

**By agent:**

```bash
curl -X POST http://localhost:3000/api/agent/content \
  -H "x-api-key: $AGENT_API_KEY" -H "Content-Type: application/json" \
  -d '{"slug":"my-new-article","title":"...","description":"...","body":"## Markdown..."}'
```

See [AGENTS.md](AGENTS.md) for the full agent contract.

## GEO surfaces (2026 AI-search optimization)

- `/llms.txt` — llmstxt.org index for AI systems
- `/llms-full.txt` — entire site content in one LLM-readable file
- `/<any-page>.md` — markdown mirror of every page (e.g. `/chatgpt.md`, `/index.md`)
- `/services.md` — machine-readable service catalog for AI buying agents
- `/robots.txt` — explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot
- `/sitemap.xml`, `/feed.xml` — generated from content collections
- `/connect` — brand-presence hub: social profiles, video library with transcripts, external mentions

## Deploying

`npm run build && npm start` on any Node host (the original design goal: no platform lock-in).
For serverless platforms (e.g. Vercel), swap `lib/db.ts` SQLite for a hosted DB (Turso/Postgres)
— the rest is portable as-is. Point the `brandbizkit.com` DNS at the new host when ready.

## Migration provenance

Content was crawled from the live site (33 sitemap pages), extracted to structured
collections, and all 58 original images were downloaded to `public/assets/` (no more
Hostinger CDN dependency). Interactive GHL widgets (persona quizzes, flipbook) are
represented as content pages; their interactive layers can be rebuilt as React components
in a follow-up.
