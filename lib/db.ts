/**
 * CRM datastore (SQLite). Leads, subscribers, and an event log for the
 * agentic pipeline. File lives in /data — swap for a hosted DB (Postgres,
 * Turso) before deploying to a serverless platform.
 */
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  db = new Database(path.join(DATA_DIR, "crm.db"));
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT,
      source TEXT,
      status TEXT DEFAULT 'new',
      synced_to_ghl INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      source TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
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
  id: number;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
  status: string;
  synced_to_ghl: number;
  created_at: string;
};

export function insertLead(lead: {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
}): number {
  const res = getDb()
    .prepare(
      "INSERT INTO leads (name, email, phone, message, source) VALUES (?, ?, ?, ?, ?)"
    )
    .run(lead.name, lead.email, lead.phone ?? null, lead.message ?? null, lead.source ?? null);
  logEvent("lead.created", "website", lead);
  return Number(res.lastInsertRowid);
}

export function markLeadSynced(id: number): void {
  getDb().prepare("UPDATE leads SET synced_to_ghl = 1 WHERE id = ?").run(id);
}

export function listLeads(): Lead[] {
  return getDb().prepare("SELECT * FROM leads ORDER BY created_at DESC").all() as Lead[];
}

export function insertSubscriber(email: string, name?: string, source?: string): void {
  getDb()
    .prepare(
      "INSERT INTO subscribers (email, name, source) VALUES (?, ?, ?) ON CONFLICT(email) DO NOTHING"
    )
    .run(email, name ?? null, source ?? null);
  logEvent("subscriber.created", "website", { email, source });
}

export function listSubscribers(): { email: string; name?: string; created_at: string }[] {
  return getDb().prepare("SELECT * FROM subscribers ORDER BY created_at DESC").all() as {
    email: string;
    name?: string;
    created_at: string;
  }[];
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
