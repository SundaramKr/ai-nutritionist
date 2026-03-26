-- Simple schema for a "phone is the ID" hackathon app.
-- Apply in Supabase SQL Editor.

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- Users table: one row per phone number.
create table if not exists public.users (
  phone text primary key,
  name text,
  user_details jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Meal plans: keep history, fetch latest by created_at.
create table if not exists public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  phone text not null references public.users(phone) on delete cascade,
  meal_plan jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists meal_plans_phone_created_at_idx
  on public.meal_plans (phone, created_at desc);

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

