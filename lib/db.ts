/**
 * CRM datastore.
 *
 * Leads, newsletter subscribers, and the internal agent/admin event log all
 * live in Supabase (see lib/supabase.ts + supabase/schema.sql) so they
 * survive serverless deploys (Netlify/Vercel functions have a read-only
 * filesystem, so local SQLite doesn't work there).
 */
import { getSupabaseAdmin } from "./supabase";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
  page_path?: string;
  experience_level?: string;
  consent: boolean;
  synced_to_ghl: boolean;
  created_at: string;
};

export type Subscriber = {
  id: string;
  email: string;
  name?: string;
  source?: string;
  page_path?: string;
  created_at: string;
};

export async function insertLead(lead: {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
  pagePath?: string;
  experienceLevel?: string;
  consent?: boolean;
}): Promise<string> {
  const { data, error } = await getSupabaseAdmin()
    .from("leads")
    .insert({
      name: lead.name,
      email: lead.email,
      phone: lead.phone ?? null,
      message: lead.message ?? null,
      source: lead.source ?? null,
      page_path: lead.pagePath ?? null,
      experience_level: lead.experienceLevel ?? null,
      consent: lead.consent ?? false,
    })
    .select("id")
    .single();
  if (error) throw new Error(`Supabase insertLead failed: ${error.message}`);
  await logEvent("lead.created", "website", lead);
  return data.id as string;
}

export async function markLeadSynced(id: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("leads")
    .update({ synced_to_ghl: true })
    .eq("id", id);
  if (error) throw new Error(`Supabase markLeadSynced failed: ${error.message}`);
}

export async function listLeads(): Promise<Lead[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Supabase listLeads failed: ${error.message}`);
  return (data ?? []) as Lead[];
}

export async function insertSubscriber(
  email: string,
  name?: string,
  source?: string,
  pagePath?: string
): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("newsletter_subscribers")
    .upsert(
      { email, name: name ?? null, source: source ?? null, page_path: pagePath ?? null },
      { onConflict: "email", ignoreDuplicates: true }
    );
  if (error) throw new Error(`Supabase insertSubscriber failed: ${error.message}`);
  await logEvent("subscriber.created", "website", { email, source, pagePath });
}

export async function listSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Supabase listSubscribers failed: ${error.message}`);
  return (data ?? []) as Subscriber[];
}

export async function logEvent(type: string, actor: string, payload: unknown): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("events")
    .insert({ type, actor, payload: payload ?? {} });
  if (error) throw new Error(`Supabase logEvent failed: ${error.message}`);
}

export async function listEvents(
  limit = 100
): Promise<{ type: string; actor: string; payload: string; created_at: string }[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("events")
    .select("type, actor, payload, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Supabase listEvents failed: ${error.message}`);
  return (data ?? []).map((e) => ({ ...e, payload: JSON.stringify(e.payload ?? {}) }));
}
