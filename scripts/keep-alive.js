#!/usr/bin/env node
/**
 * Supabase keep-alive — run by .github/workflows/supabase-keepalive.yml (daily)
 * or manually with `npm run keep-alive`.
 *
 * 1. Reads one row from two real tables straight through Supabase's REST API.
 * 2. Falls back to / also pings the live site's /api/keep-alive (LIVE_URL).
 *
 * Exits non-zero (red workflow run) when neither route reaches the database,
 * and prints a ::warning:: when only the fallback worked, so a broken secret
 * can't fail silently again.
 */
const TABLES = ["leads", "newsletter_subscribers"];
const url = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
const liveUrl = (process.env.LIVE_URL || "").replace(/\/+$/, "");

async function get(target, headers = {}) {
  try {
    const res = await fetch(target, { headers, signal: AbortSignal.timeout(20000) });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    const code = err.cause?.code || err.name;
    const hint = code === "ENOTFOUND" ? " (host not found — project paused or SUPABASE_URL wrong?)" : "";
    return { ok: false, status: 0, error: `${code}${hint}` };
  }
}

async function pingDatabase() {
  if (!url || !key) {
    console.log("Direct check skipped: SUPABASE_URL / key not set.");
    return false;
  }
  let allOk = true;
  for (const table of TABLES) {
    const r = await get(`${url}/rest/v1/${table}?select=id&limit=1`, {
      apikey: key,
      Authorization: `Bearer ${key}`,
    });
    console.log(`DB ${table}: ${r.ok ? "ok" : "FAILED"} (${r.error || `HTTP ${r.status}`})`);
    allOk = allOk && r.ok;
  }
  return allOk;
}

async function pingLiveSite() {
  if (!liveUrl) return null;
  const headers = process.env.CRON_SECRET ? { Authorization: `Bearer ${process.env.CRON_SECRET}` } : {};
  const r = await get(`${liveUrl}/api/keep-alive`, headers);
  console.log(`Live ${liveUrl}/api/keep-alive: ${r.ok ? "ok" : "FAILED"} (${r.error || `HTTP ${r.status}`})`);
  return r.ok;
}

(async () => {
  const direct = await pingDatabase();
  const live = await pingLiveSite();
  if (direct) return console.log("Keep-alive successful.");
  if (live) {
    console.log("::warning::Direct Supabase check failed but the live endpoint reached the database. Check the SUPABASE_* GitHub secrets.");
    return;
  }
  console.error("::error::Keep-alive failed — the database was not reached. The Supabase project may be paused.");
  process.exit(1);
})();
