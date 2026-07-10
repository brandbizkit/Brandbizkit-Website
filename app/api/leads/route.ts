import { NextRequest, NextResponse } from "next/server";
import { insertLead, markLeadSynced } from "@/lib/db";
import { forwardLeadToGhl } from "@/lib/ghl";

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
  const lead = {
    name,
    email,
    phone: body.phone ? String(body.phone) : undefined,
    message: body.message ? String(body.message).slice(0, 5000) : undefined,
    source: body.source ? String(body.source) : "website",
  };
  const id = insertLead(lead);
  const synced = await forwardLeadToGhl(lead);
  if (synced) markLeadSynced(id);
  return NextResponse.json({ ok: true, id, synced });
}
