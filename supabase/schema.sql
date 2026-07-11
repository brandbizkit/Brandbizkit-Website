-- BrandBizkit CRM schema
-- Run this once in the Supabase dashboard: Project → SQL Editor → New query
-- → paste this whole file → Run.

create extension if not exists pgcrypto;

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text,
  source text,
  page_path text,
  experience_level text, -- AI School signup only: none | some | experienced
  consent boolean not null default false, -- terms/marketing consent checkbox
  synced_to_ghl boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  source text,
  page_path text,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists newsletter_subscribers_created_at_idx on newsletter_subscribers (created_at desc);

-- Row Level Security is enabled with NO policies attached on purpose: this
-- locks both tables down completely from the public anon/authenticated
-- roles. The site never talks to Supabase directly from the browser — every
-- read/write goes through our own Next.js API routes using the
-- SUPABASE_SERVICE_ROLE_KEY (server-only, bypasses RLS). That key must
-- never be exposed to the client or committed to the repo.
alter table leads enable row level security;
alter table newsletter_subscribers enable row level security;
