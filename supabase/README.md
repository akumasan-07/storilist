# Supabase Setup Guide

Follow these steps to apply database migrations in your Supabase project.

---

## 1. Apply Schema Migrations (in numbered order)

1. Open your project dashboard at [supabase.com](https://supabase.com/dashboard).
2. Navigate to the **SQL Editor** from the left navigation bar.
3. Apply each migration in order:
   - **[`migrations/0001_init.sql`](./migrations/0001_init.sql)**: Creates core tables (`media`, `profiles`, `library_entries`), indexes, triggers, and Row Level Security (RLS) policies.
   - **[`migrations/0002_username.sql`](./migrations/0002_username.sql)**: Adds unique username support and trigger logic.
   - **[`migrations/0003_external_media.sql`](./migrations/0003_external_media.sql)**: Adds external provider source tracking columns and unique index on `(source, external_id)` for dynamic provider imports.
4. Confirm each query execution succeeds.

---

## 2. Dynamic Catalogue Management

Catalogue entries are created dynamically from external provider data (e.g., TMDB) when users track titles. There is no manual catalogue seeding required. When a title is tracked:
- The server validates the provider ID format (e.g., `tmdb-movie-<id>` or `tmdb-tv-<id>`).
- Full metadata is retrieved from the provider and written to `public.media` using the service-role client.
- The title is then linked to the user's personal `public.library_entries`.

---

## 3. Verification

- Go to **Table Editor** > **media**: verify table structure is intact with `source`, `external_id`, and `fetched_at` columns.
- `public.profiles` and `public.library_entries` receive rows as users register and manage their library.
