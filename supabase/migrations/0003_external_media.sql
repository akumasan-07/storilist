-- 0003_external_media.sql
-- Support external catalogue providers (TMDB, and future MAL, OpenLibrary)
-- Note: media table remains read-only for users via RLS. Only server-side admin writes to it.

-- 1. Add external provider tracking columns
alter table public.media
  add column if not exists source text check (source is null or source in ('tmdb', 'mal', 'openlibrary')),
  add column if not exists external_id text,
  add column if not exists fetched_at timestamptz;

-- 2. Unique index on (source, external_id) where source is not null
create unique index if not exists idx_media_source_external_id
  on public.media (source, external_id)
  where source is not null;

-- Standard unique constraint to allow PostgREST's on_conflict=source,external_id resolution.
-- In PostgreSQL, UNIQUE constraints allow multiple rows with NULL values (e.g. sample items where source is NULL).
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'media_source_external_id_key'
      and conrelid = 'public.media'::regclass
  ) then
    alter table public.media add constraint media_source_external_id_key unique (source, external_id);
  end if;
end $$;

-- 3. Relax NOT NULL constraints that external data may legitimately miss
-- Poster: external titles may have no poster image available
alter table public.media alter column poster drop not null;

-- Studio: titles may not have production companies or networks listed
alter table public.media alter column studio drop not null;

-- Start Year: announced or unreleased titles may not have a release date yet
alter table public.media alter column start_year drop not null;

-- Format: allow flexibility for external provider imports
alter table public.media alter column format drop not null;
