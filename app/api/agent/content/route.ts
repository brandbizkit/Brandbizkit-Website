/**
 * Agent publishing API — the write surface for automated content pipelines.
 *
 * GET  /api/agent/content            → list all content (posts, tools, pages)
 * POST /api/agent/content            → create/update a blog post from JSON
 *   { slug, title, description, body (markdown), date?, author?, image?, videos? }
 *
 * Auth: x-api-key header matching AGENT_API_KEY. Content is written to the
 * content/ directory, so every agent publish is a reviewable file change —
 * schema, sitemap, llms.txt, RSS, and markdown mirrors update automatically.
 */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { agentAuthorized } from "@/lib/agent-auth";
import { getAllSlugs, getPosts } from "@/lib/content";
import { logEvent } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!agentAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    slugs: getAllSlugs(),
    posts: getPosts().map(({ body, ...meta }) => ({ ...meta, bodyLength: body.length })),
  });
}

export async function POST(req: NextRequest) {
  if (!agentAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const slug = String(body.slug ?? "").toLowerCase();
  if (!/^[a-z0-9-]{3,120}$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug (a-z, 0-9, hyphens)" }, { status: 400 });
  }
  const required = ["title", "description", "body"] as const;
  for (const f of required) {
    if (!body[f] || typeof body[f] !== "string") {
      return NextResponse.json({ error: `Missing field: ${f}` }, { status: 400 });
    }
  }
  const today = new Date().toISOString().slice(0, 10);
  const fm = {
    title: body.title,
    description: body.description,
    date: (body.date as string) ?? today,
    updated: today,
    author: (body.author as string) ?? "BrandBizkit",
    image: (body.image as string) ?? "",
    videos: Array.isArray(body.videos) ? body.videos : [],
  };
  const md =
    "---\n" +
    Object.entries(fm)
      .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
      .join("\n") +
    "\n---\n\n" +
    String(body.body).trim() +
    "\n";

  const file = path.join(process.cwd(), "content", "posts", `${slug}.md`);
  const existed = fs.existsSync(file);
  fs.writeFileSync(file, md);
  logEvent(existed ? "content.updated" : "content.created", "agent-api", { slug });
  return NextResponse.json({ ok: true, slug, action: existed ? "updated" : "created", url: `/${slug}` });
}
