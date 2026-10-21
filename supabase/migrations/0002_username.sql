-- Migration 0002: Case-insensitive unique username, metadata sync in handle_new_user, and username availability check

-- 1. Case-insensitive unique index on lower(username) for public.profiles
create unique index if not exists profiles_username_lower_idx
  on public.profiles (lower(username))
  where username is not null;

-- 2. Update handle_new_user trigger function to read username from raw_user_meta_data
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    nullif(trim(new.raw_user_meta_data ->> 'username'), '')
  );
  return new;
end;
$$;

-- 3. Function to check if a username is available (case-insensitive)
create or replace function public.is_username_available(name text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if name is null or trim(name) = '' then
    return false;
  end if;

  return not exists (
    select 1
    from public.profiles
    where lower(username) = lower(trim(name))
  );
end;
$$;

grant execute on function public.is_username_available(text) to anon, authenticated;
