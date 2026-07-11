import { NextRequest, NextResponse } from "next/server";
import { insertLead, markLeadSynced } from "@/lib/db";
import { forwardLeadToGhl } from "@/lib/ghl";

const EXPERIENCE_LEVELS = new Set(["none", "some", "experienced"]);

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Name and valid email are required" }, { status: 400 });
  }
  const source = body.source ? String(body.source) : "website";
  const experienceLevel =
    body.experienceLevel && EXPERIENCE_LEVELS.has(String(body.experienceLevel))
      ? String(body.experienceLevel)
      : undefined;
  const consent = body.consent === true;

  // The AI School signup form carries a legal consent checkbox — enforce it
  // server-side too, not just via the required attribute on the client.
  if (source === "ai-school" && !consent) {
    return NextResponse.json({ error: "Please agree to the terms to continue" }, { status: 400 });
  }

  const lead = {
    name,
    email,
    phone: body.phone ? String(body.phone) : undefined,
    message: body.message ? String(body.message).slice(0, 5000) : undefined,
    source,
    pagePath: body.pagePath ? String(body.pagePath).slice(0, 300) : undefined,
    experienceLevel,
    consent,
  };
  const id = await insertLead(lead);
  const synced = await forwardLeadToGhl(lead);
  if (synced) await markLeadSynced(id);
  return NextResponse.json({ ok: true, id, synced });
}
