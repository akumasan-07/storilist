# StoriList

A unified cross-medium narrative tracking platform designed for tracking **Anime**, **Comics / Manga**, **Movies**, **Series**, and **Novels** in one cohesive personal library.

---

## Features Implemented

- **Unified Cross-Medium Library**: Track works across five narrative mediums with format-specific progress units (episodes, chapters, runtime minutes, pages).
- **Personal Log & Status Management**: Manage tracking statuses (*Planned*, *In Progress*, *Completed*, *Dropped*), precision decimal ratings (1–10), progress steppers, and personal notes.
- **Database-Backed Personal Library**: User library entries and catalogue stored in Supabase PostgreSQL with Row Level Security (RLS), optimistic updates, automatic rollback on error, and server-side ownership checks.
- **Authentication & Profiles**: Secure email + password authentication, required unique usernames with case-insensitive validation, secure cookie-based session management, and account dropdown in the Navbar.
- **Dynamic Discovery & Search**: Instant multi-attribute search and filtering across mediums, formats, and genres.
- **Deep-Linked URL State**: Filter and search states in Discover sync seamlessly with browser URL query parameters (`q`, `category`, `genre`, `sort`) with debounced updating, browser history navigation support, and zero scroll jump.
- **Server-Rendered Title Pages**: Server Component title pages featuring dynamic metadata generation, instant skeleton loading states, related titles, and robust 404 (`notFound()`) and error handling boundaries.
- **Accessible & Responsive Design**: Dark/light theme support, accessible modal dialogs, keyboard navigation (`Escape` closing), and click-outside dismissal.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Auth via `@supabase/ssr` & `@supabase/supabase-js`)
- **Validation**: [Zod](https://zod.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Getting Started

### Prerequisites

- Node.js 18.17+ or later
- npm (or yarn / pnpm / bun)

### Environment Variables

Create a `.env.local` file in the root directory (see `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Apply migrations and catalogue seed data in Supabase following [supabase/README.md](supabase/README.md).

### Installation & Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` — Launch the local development server.
- `npm run build` — Create an optimized production build.
- `npm run start` — Run the compiled production server.
- `npm run lint` — Run ESLint across the codebase.

---

## Roadmap

- [x] **Backend & Authentication**: Supabase (PostgreSQL, RLS), secure cookie session refresh, email + password auth, username validation, and protected routes.
- [x] **Database Library Sync**: Transition personal library entries and catalogue to Supabase PostgreSQL database with Server Actions and optimistic updates.
- [ ] **Real Catalogue Data Integration**: Live external API integrations with AniList (anime/manga), TMDB (movies/series), and Open Library / Google Books (novels).
- [ ] **Stats & Activity Timeline**: Reading and watch velocity tracking, completion timelines, monthly habit streaks, and annual reading/watching wrap-ups.
