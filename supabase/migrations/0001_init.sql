-- MEDIA (public catalogue, read-only for users)
create table public.media (
  id text primary key,
  title text not null,
  category text not null check (category in ('Anime','Comics','Movies','Series','Novels')),
  format text not null,
  studio text not null,
  poster text not null,
  synopsis text not null default '',
  genres text[] not null default '{}',
  rating numeric(3,1) check (rating between 0 and 10),
  start_year int not null,
  end_year int,
  total_progress int check (total_progress is null or total_progress >= 0),
  progress_unit text not null check (progress_unit in ('episodes','chapters','mins','volumes')),
  release_status text not null check (release_status in ('Completed','Ongoing')),
  creators text[] not null default '{}',
  tagline text,
  created_at timestamptz not null default now()
);

-- PROFILES (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique check (username ~ '^[a-zA-Z0-9_]{3,20}$'),
  display_name text check (display_name is null or char_length(display_name) <= 50),
  created_at timestamptz not null default now()
);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end; $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- LIBRARY ENTRIES (one per user per title)
create table public.library_entries (
  user_id uuid not null references auth.users(id) on delete cascade,
  media_id text not null references public.media(id) on delete cascade,
  status text not null check (status in ('Planned','In Progress','Completed','Dropped')),
  current_progress int not null default 0 check (current_progress >= 0),
  user_rating numeric(3,1) check (user_rating is null or user_rating between 0 and 10),
  notes text check (notes is null or char_length(notes) <= 2000),
  added_at timestamptz not null default now(),
  last_updated timestamptz not null default now(),
  primary key (user_id, media_id)
);
create index library_entries_user_status_idx on public.library_entries (user_id, status);

create function public.set_last_updated() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.last_updated = now();
  return new;
end; $$;

create trigger library_entries_set_last_updated
before update on public.library_entries
for each row execute function public.set_last_updated();

-- ROW LEVEL SECURITY
alter table public.media enable row level security;
alter table public.profiles enable row level security;
alter table public.library_entries enable row level security;

create policy "media is readable by everyone" on public.media
  for select to anon, authenticated using (true);

create policy "users read own profile" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "users update own profile" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "users read own entries" on public.library_entries
  for select to authenticated using (user_id = (select auth.uid()));
create policy "users insert own entries" on public.library_entries
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "users update own entries" on public.library_entries
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "users delete own entries" on public.library_entries
  for delete to authenticated using (user_id = (select auth.uid()));
