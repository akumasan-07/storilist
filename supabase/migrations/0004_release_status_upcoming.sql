-- 0004_release_status_upcoming.sql
-- Allow 'Upcoming' release status for unreleased/announced external titles

alter table public.media drop constraint if exists media_release_status_check;

alter table public.media add constraint media_release_status_check
  check (release_status in ('Completed', 'Ongoing', 'Upcoming'));

