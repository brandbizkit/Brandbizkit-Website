import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Server-only Supabase client using the service role key — bypasses RLS.
 *
 * Never import this from a "use client" component or expose the service
 * role key to the browser. All reads/writes go through our own API routes
 * and Server Components, so the Supabase tables can stay fully locked down
 * (RLS enabled, zero public policies) — see supabase/schema.sql.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env"
    );
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}
