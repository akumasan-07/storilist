# Supabase Setup Guide

Follow these steps to apply database migrations and seed data in your Supabase project.

---

## 1. Apply Schema Migration

1. Open your project dashboard at [supabase.com](https://supabase.com/dashboard).
2. Navigate to the **SQL Editor** from the left navigation bar.
3. Click **New query**.
4. Copy and paste the entire contents of [`migrations/0001_init.sql`](./migrations/0001_init.sql).
5. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`).
6. Confirm that the output shows `Success. No rows returned`.

This creates the tables (`media`, `profiles`, `library_entries`), indexes, triggers, and Row Level Security (RLS) policies.

---

## 2. Seed Catalogue Data

1. In the **SQL Editor**, click **New query**.
2. Copy and paste the entire contents of [`seed.sql`](./seed.sql).
3. Click **Run**.
4. Confirm execution succeeds.

This populates `public.media` with all 15 starter titles. The statement uses `ON CONFLICT (id) DO UPDATE` so it can be re-run safely at any time.

---

## 3. Verification

- Go to **Table Editor** > **media**: verify all 15 records are present with their categories, genres, creators, and formats.
- `public.profiles` and `public.library_entries` remain empty until real users sign up and add items to their personal library.
