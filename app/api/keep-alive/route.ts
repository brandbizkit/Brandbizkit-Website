import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Free-tier Supabase projects pause after 7 days without activity. This
// endpoint does a cheap read on two real tables; Vercel Cron (vercel.json)
// and the GitHub Actions workflow both hit it daily.
export const dynamic = "force-dynamic";

const TABLES = ["leads", "newsletter_subscribers"] as const;

export async function GET(req: NextRequest) {
  // Vercel Cron sends `Authorization: Bearer $CRON_SECRET` when the env var is set.
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { success: false, message: "Supabase credentials are not configured." },
      { status: 503 }
    );
  }

  const db = getSupabaseAdmin();
  const details: Record<string, { status: number; ok: boolean }> = {};
  for (const table of TABLES) {
    const { error, status } = await db.from(table).select("id", { count: "exact", head: true });
    if (error) console.error(`keep-alive: ${table} query failed: ${error.message}`);
    details[table] = { status, ok: !error };
  }

  const success = Object.values(details).every((d) => d.ok);
  return NextResponse.json(
    {
      success,
      timestamp: new Date().toISOString(),
      message: success ? "Supabase keep-alive ping successful." : "Supabase keep-alive ping failed.",
      details,
    },
    { status: success ? 200 : 500 }
  );
}
