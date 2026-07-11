/**
 * CRM datastore.
 *
 * Leads and newsletter subscribers — the actual customer-facing data — live
 * in Supabase (see lib/supabase.ts + supabase/schema.sql) so they survive a
 * serverless deploy and are queryable outside this codebase. The internal
 * agent/admin event log stays on local SQLite: it's a low-stakes debug
 * trail, not customer data, and doesn't need to be durable across deploys.
 */
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { getSupabaseAdmin } from "./supabase";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;
  db = new Database(path.join(DATA_DIR, "crm.db"));
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      actor TEXT NOT NULL DEFAULT 'system',
      payload TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  return db;
}

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
  logEvent("lead.created", "website", lead);
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
  logEvent("subscriber.created", "website", { email, source, pagePath });
}

export async function listSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Supabase listSubscribers failed: ${error.message}`);
  return (data ?? []) as Subscriber[];
}

export function logEvent(type: string, actor: string, payload: unknown): void {
  getDb()
    .prepare("INSERT INTO events (type, actor, payload) VALUES (?, ?, ?)")
    .run(type, actor, JSON.stringify(payload ?? {}));
}

export function listEvents(limit = 100): { type: string; actor: string; payload: string; created_at: string }[] {
  return getDb()
    .prepare("SELECT * FROM events ORDER BY created_at DESC LIMIT ?")
    .all(limit) as { type: string; actor: string; payload: string; created_at: string }[];
}
