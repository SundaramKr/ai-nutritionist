-- Simple schema for a "phone is the ID" hackathon app.
-- Apply in Supabase SQL Editor.

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- Users table: one row per phone number.
create table if not exists public.users (
  phone text primary key,
  name text,
  password_hash text,
  user_details jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- If the table already existed without password_hash, add it.
alter table public.users
add column if not exists password_hash text;

-- Meal plans: keep ONLY the latest per phone.
create table if not exists public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  phone text not null references public.users(phone) on delete cascade,
  meal_plan jsonb not null,
  created_at timestamptz not null default now()
);

-- Enforce one row per phone.
-- If you already have duplicates, run the cleanup SQL below once before adding the constraint.
create unique index if not exists meal_plans_phone_unique_idx
  on public.meal_plans (phone);

-- One-time cleanup (run manually if you already inserted multiple rows per phone):
-- delete from public.meal_plans mp
-- where mp.id not in (
--   select id
--   from (
--     select distinct on (phone) id, phone, created_at
--     from public.meal_plans
--     order by phone, created_at desc
--   ) keep_latest
-- );

-- Keep updated_at current.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

-- Security: keep tables locked down; Edge Functions use SERVICE_ROLE key.
alter table public.users enable row level security;
alter table public.meal_plans enable row level security;

-- No public (anon) table access.
drop policy if exists "anon read users" on public.users;
drop policy if exists "anon write users" on public.users;
drop policy if exists "anon read meal_plans" on public.meal_plans;
drop policy if exists "anon write meal_plans" on public.meal_plans;

