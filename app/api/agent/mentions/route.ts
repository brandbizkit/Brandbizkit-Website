/**
 * Agent API for the brand-mention registry (GEO presence tracking).
 * POST { title, url, source, type?, date?, quote? } appends to content/mentions.json.
 */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { agentAuthorized } from "@/lib/agent-auth";
import { logEvent } from "@/lib/db";

const FILE = path.join(process.cwd(), "content", "mentions.json");

export async function GET(req: NextRequest) {
  if (!agentAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(JSON.parse(fs.readFileSync(FILE, "utf8")));
}

export async function POST(req: NextRequest) {
  if (!agentAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.title || !body.url || !body.source) {
    return NextResponse.json({ error: "title, url, source required" }, { status: 400 });
  }
  const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
  const mention = {
    title: String(body.title),
    url: String(body.url),
    source: String(body.source),
    type: String(body.type ?? "article"),
    date: String(body.date ?? new Date().toISOString().slice(0, 10)),
    quote: String(body.quote ?? ""),
  };
  data.mentions = [...data.mentions.filter((m: { url: string }) => m.url !== mention.url), mention];
  fs.writeFileSync(FILE, JSON.stringify(data, null, 1));
  await logEvent("mention.added", "agent-api", mention);
  return NextResponse.json({ ok: true, count: data.mentions.length });
}
