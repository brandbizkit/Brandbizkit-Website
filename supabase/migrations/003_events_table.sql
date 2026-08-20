-- Internal admin/agent event log — replaces local SQLite so it survives
-- serverless deploys (Netlify/Vercel functions have a read-only filesystem).
-- Run this once in the Supabase dashboard: Project → SQL Editor → New query
-- → paste this whole file → Run.

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  actor text not null default 'system',
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists events_created_at_idx on events (created_at desc);

alter table events enable row level security;
