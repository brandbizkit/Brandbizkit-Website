/**
 * Agent API for the video registry — primarily used to attach transcripts
 * so AI search engines can index and recommend specific videos.
 * POST { id, transcript?, title?, description?, pages? } updates content/videos.json.
 */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { agentAuthorized } from "@/lib/agent-auth";
import { logEvent } from "@/lib/db";

const FILE = path.join(process.cwd(), "content", "videos.json");

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
  const id = String(body.id ?? "");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
  const existing = data.videos.find((v: { id: string }) => v.id === id);
  if (existing) {
    if (body.transcript !== undefined) existing.transcript = String(body.transcript);
    if (body.title !== undefined) existing.title = String(body.title);
    if (body.description !== undefined) existing.description = String(body.description);
    if (Array.isArray(body.pages)) existing.pages = body.pages;
  } else {
    data.videos.push({
      id,
      provider: "youtube",
      title: String(body.title ?? id),
      description: String(body.description ?? ""),
      pages: Array.isArray(body.pages) ? body.pages : [],
      transcript: String(body.transcript ?? ""),
    });
  }
  fs.writeFileSync(FILE, JSON.stringify(data, null, 1));
  logEvent(existing ? "video.updated" : "video.added", "agent-api", { id });
  return NextResponse.json({ ok: true, id });
}
