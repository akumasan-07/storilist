<h1 align="center">StoriList</h1>

<p align="center">
  One personal library for everything you watch and read: <strong>anime</strong>, <strong>comics</strong>, <strong>movies</strong>, <strong>series</strong> and <strong>novels</strong>.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" />
  <img alt="React" src="https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white" />
</p>

<p align="center">
  <a href="https://storilist.vercel.app/"><strong>Live demo</strong></a>
</p>

<!--
Screenshots: add images to docs/screenshots/ and uncomment.

## Screenshots

| Discover | Library |
| --- | --- |
| ![Discover](docs/screenshots/discover.png) | ![Library](docs/screenshots/library.png) |
-->

## Why StoriList

Tracking apps usually cover one medium. StoriList keeps anime, comics, movies, series and novels in a single library, each with progress that fits the format (episodes, chapters, volumes or minutes), plus a status, a 1-10 rating and personal notes.

It's a non-commercial personal project built for a small group of friends and family.

## Features

- **Unified library:** five media categories, four statuses (Planned, In Progress, Completed, Dropped), progress steppers, 1-10 ratings and notes.
- **Accounts:** email and password sign-up with unique usernames, password reset, protected routes and cookie-based sessions.
- **Database-backed:** library data lives in PostgreSQL with Row-Level Security. The UI updates optimistically and rolls back with a message if a save fails.
- **Discover:** search and filter by category, format and genre. Filters live in the URL, so views can be bookmarked and shared.
- **Live TMDB titles:** any TMDB movie or series opens as a full title page and can be tracked. The server saves a title to the catalogue only when a user tracks it.
- **Title pages:** server-rendered with per-title metadata, related titles, loading skeletons and proper 404 and error pages.
- **Polish:** responsive layout, light and dark themes, accessible dialogs and menus, and a social share preview image.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Database and auth | Supabase (PostgreSQL, Auth, Row-Level Security) via `@supabase/ssr` |
| Validation | Zod |
| Styling | Tailwind CSS v4, lucide-react |
| Data sources | TMDB API (more in the roadmap) |
| Hosting | Vercel |

## How It Works

- **Data model:** `media` holds the catalogue, `library_entries` holds one row per user per title, and `profiles` extends `auth.users`. Entries store only user data (status, progress, rating, notes) and are joined with `media` for display.
- **Security:** Row-Level Security limits every user to their own entries. The catalogue is read-only to clients, and only server code can write to it, using a service-role key that never reaches the browser.
- **Writes:** all changes go through Server Actions. Input is validated with Zod, the user comes from the verified session (never from the client), and library rules such as status normalization run on the server.
- **External titles:** the client sends only a title ID such as `tmdb-movie-27205`. The server validates it, fetches the data from the provider, saves it, and then creates the user's entry. The client never supplies catalogue data.
- **Caching:** provider requests use Next.js fetch revalidation, and saved titles are refreshed in the background once they're older than 30 days.

## Getting Started

### Prerequisites

- Node.js 20.9 or later
- A free [Supabase](https://supabase.com/) project
- A [TMDB](https://www.themoviedb.org/) API read access token

### Setup

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/akumasan-07/storilist.git
   cd storilist
   npm install
   ```
2. In the Supabase SQL Editor, run every file in `supabase/migrations/` in order (see [supabase/README.md](supabase/README.md)).
3. In Supabase, open **Authentication → URL Configuration**. Set the Site URL to `http://localhost:3000` and add `http://localhost:3000/**` to the Redirect URLs.
4. Copy `.env.example` to `.env.local` and fill in the values below.
5. Start the dev server and open [http://localhost:3000](http://localhost:3000):
   ```bash
   npm run dev
   ```

### Environment Variables

| Variable | Description | Secret |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable (anon) key | No |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, used in auth emails (set it in production) | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase secret key, server-only, used to save provider titles | **Yes** |
| `TMDB_READ_ACCESS_TOKEN` | TMDB v4 read access token, server-only | **Yes** |

Never commit `.env.local`, and never prefix secrets with `NEXT_PUBLIC_`.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Deployment

Deploy on [Vercel](https://vercel.com/) and add the same environment variables, with `NEXT_PUBLIC_SITE_URL` set to your production URL. Redeploy after changing any variable. Then add the production URL to Supabase under **Authentication → URL Configuration** (Site URL, plus `https://your-domain/**` in the Redirect URLs).

## Roadmap

- [x] Authentication, usernames and password reset
- [x] Database-backed library with Row-Level Security and server-side validation
- [x] TMDB title pages and tracking (movies and series)
- [x] Discover powered by live TMDB data (popular titles and search)
- [ ] MyAnimeList integration (anime, manga and manhwa)
- [ ] Open Library integration (novels)
- [ ] Stats and activity timeline

## Credits

This product uses the TMDB API but is not endorsed or certified by TMDB. Anime and manga data will come from the MyAnimeList API and novel data from Open Library. Attribution for each source is on the app's About page.