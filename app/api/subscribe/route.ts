import { NextRequest, NextResponse } from "next/server";
import { insertSubscriber } from "@/lib/db";
import { forwardLeadToGhl } from "@/lib/ghl";

const VALID_SOURCES = new Set(["newsletter", "footer", "popup_scroll", "popup_exit_insights"]);

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const email = String(body.email ?? "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  const name = body.name ? String(body.name) : undefined;
  const source = VALID_SOURCES.has(String(body.source)) ? String(body.source) : "newsletter";
  const pagePath = body.pagePath ? String(body.pagePath).slice(0, 300) : undefined;

  await insertSubscriber(email, name, source, pagePath);
  await forwardLeadToGhl({ name: name ?? email, email, source });
  return NextResponse.json({ ok: true });
}
