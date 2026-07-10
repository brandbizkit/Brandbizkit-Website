import { NextRequest, NextResponse } from "next/server";
import { insertSubscriber } from "@/lib/db";
import { forwardLeadToGhl } from "@/lib/ghl";

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
  insertSubscriber(email, name, "newsletter");
  await forwardLeadToGhl({ name: name ?? email, email, source: "newsletter" });
  return NextResponse.json({ ok: true });
}
