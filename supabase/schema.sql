-- Rare Shades — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- 1. Enable UUID generation
create extension if not exists "uuid-ossp";

-- 2. User profiles (mirrors auth.users)
create table if not exists public.app_user (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  username      text unique not null,
  avatar_initials text,
  home_region   text,
  bio           text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 3. Sightings logbook
create table if not exists public.sighting (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.app_user(id) on delete cascade,
  color_slug     text not null,
  color_name     text not null,
  color_family   text not null default 'Other',
  color_hex      text not null default '#888888',
  rarity         text not null default 'Uncommon',
  model          text not null,
  model_year     integer,
  spotted_on     date not null,
  location_label text not null,
  notes          text,
  photo_url      text,
  photo_position text not null default '50% 50%',
  photo_scale    float not null default 1.0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Storage bucket for sighting photos (run once in Supabase Dashboard → Storage)
-- insert into storage.buckets (id, name, public) values ('sighting-photos', 'sighting-photos', true);
-- create policy "Users can upload own sighting photos"
--   on storage.objects for insert
--   with check (bucket_id = 'sighting-photos' and auth.uid()::text = (storage.foldername(name))[1]);
-- create policy "Users can update own sighting photos"
--   on storage.objects for update
--   using (bucket_id = 'sighting-photos' and auth.uid()::text = (storage.foldername(name))[1]);
-- create policy "Anyone can view sighting photos"
--   on storage.objects for select
--   using (bucket_id = 'sighting-photos');

create index if not exists sighting_user_idx on public.sighting(user_id, spotted_on desc);

-- 4. Sighting photos (supports up to 3 per sighting)
create table if not exists public.sighting_photo (
  id           uuid primary key default uuid_generate_v4(),
  sighting_id  uuid not null references public.sighting(id) on delete cascade,
  photo_url    text not null,
  photo_position text not null default '50% 50%',
  photo_scale  float not null default 1.0,
  sort_order   int  not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists sighting_photo_sighting_idx on public.sighting_photo(sighting_id, sort_order);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.app_user enable row level security;
alter table public.sighting  enable row level security;
alter table public.sighting_photo enable row level security;

-- app_user: users can only see and edit their own profile
create policy "Users can view own profile"
  on public.app_user for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.app_user for update
  using (auth.uid() = id);

-- sighting: full CRUD for owner only
create policy "Users can view own sightings"
  on public.sighting for select
  using (auth.uid() = user_id);

create policy "Users can insert own sightings"
  on public.sighting for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sightings"
  on public.sighting for update
  using (auth.uid() = user_id);

create policy "Users can delete own sightings"
  on public.sighting for delete
  using (auth.uid() = user_id);

-- sighting_photo: accessible through sighting ownership
create policy "Users can view own sighting photos"
  on public.sighting_photo for select
  using (sighting_id in (select id from public.sighting where user_id = auth.uid()));

create policy "Users can insert own sighting photos"
  on public.sighting_photo for insert
  with check (sighting_id in (select id from public.sighting where user_id = auth.uid()));

create policy "Users can update own sighting photos"
  on public.sighting_photo for update
  using (sighting_id in (select id from public.sighting where user_id = auth.uid()));

create policy "Users can delete own sighting photos"
  on public.sighting_photo for delete
  using (sighting_id in (select id from public.sighting where user_id = auth.uid()));

-- ============================================================
-- Trigger: auto-create app_user when someone signs up
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.app_user (id, email, username, avatar_initials)
  values (
    new.id,
    new.email,
    -- username = email prefix + first 6 chars of UUID (avoids collisions)
    lower(
      regexp_replace(split_part(new.email, '@', 1), '[^a-z0-9]', '', 'g')
    ) || '_' || substr(new.id::text, 1, 6),
    upper(left(split_part(new.email, '@', 1), 2))
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop and recreate to ensure it's current
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
