/**
 * Agent API for the free-AI-tools directory (the weekly research agent's
 * write surface).
 *
 * GET  → current directory
 * POST → replace or merge the directory:
 *   { categories: [...] }                    → full replace (updatedAt set automatically)
 *   { merge: true, categories: [...] }      → upsert tools into existing categories by name
 *   { updateNote: "..." }                    → note shown in the admin/event log
 */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { agentAuthorized } from "@/lib/agent-auth";
import { logEvent } from "@/lib/db";
import type { ToolCategory, DirectoryTool } from "@/lib/tools-directory";

const FILE = path.join(process.cwd(), "content", "tools-directory.json");

function validCategory(c: unknown): c is ToolCategory {
  const cat = c as ToolCategory;
  return (
    !!cat &&
    typeof cat.id === "string" &&
    typeof cat.title === "string" &&
    Array.isArray(cat.tools) &&
    cat.tools.every(
      (t: DirectoryTool) =>
        typeof t.name === "string" &&
        typeof t.url === "string" &&
        t.url.startsWith("http") &&
        typeof t.why === "string" &&
        ["free", "free-credits", "freemium"].includes(t.pricing)
    )
  );
}

export async function GET(req: NextRequest) {
  if (!agentAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(JSON.parse(fs.readFileSync(FILE, "utf8")));
}

export async function POST(req: NextRequest) {
  if (!agentAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { categories?: unknown[]; merge?: boolean; updateNote?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!Array.isArray(body.categories) || !body.categories.every(validCategory)) {
    return NextResponse.json(
      { error: "categories must be an array of {id,title,blurb,tools:[{name,url,why,pricing,freeDetails}]}" },
      { status: 400 }
    );
  }
  const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
  const today = new Date().toISOString().slice(0, 10);

  if (body.merge) {
    for (const incoming of body.categories as ToolCategory[]) {
      const existing = data.categories.find((c: ToolCategory) => c.id === incoming.id);
      if (!existing) {
        data.categories.push(incoming);
        continue;
      }
      if (incoming.title) existing.title = incoming.title;
      if (incoming.blurb) existing.blurb = incoming.blurb;
      for (const tool of incoming.tools) {
        const i = existing.tools.findIndex(
          (t: DirectoryTool) => t.name.toLowerCase() === tool.name.toLowerCase()
        );
        if (i >= 0) existing.tools[i] = { ...existing.tools[i], ...tool, lastVerified: today };
        else existing.tools.push({ ...tool, lastVerified: today });
      }
    }
  } else {
    data.categories = body.categories;
  }
  data.updatedAt = today;
  if (body.updateNote) data.updateNote = String(body.updateNote);

  fs.writeFileSync(FILE, JSON.stringify(data, null, 1));
  await logEvent("tools-directory.updated", "agent-api", {
    mode: body.merge ? "merge" : "replace",
    note: body.updateNote ?? "",
    categories: (body.categories as ToolCategory[]).map((c) => c.id),
  });
  return NextResponse.json({ ok: true, updatedAt: today });
}
