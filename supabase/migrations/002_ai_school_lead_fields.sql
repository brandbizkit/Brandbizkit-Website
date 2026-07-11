-- Adds AI School-specific fields to the existing leads table.
-- Run this once in the Supabase SQL Editor if your `leads` table was created
-- before this migration (i.e. you already ran the original schema.sql).
-- Safe to run multiple times.

alter table leads add column if not exists experience_level text;
alter table leads add column if not exists consent boolean not null default false;

comment on column leads.experience_level is
  'AI School signup only: none | some | experienced — self-reported AI tool experience';
comment on column leads.consent is
  'Whether the lead checked the terms/marketing consent checkbox at signup';
