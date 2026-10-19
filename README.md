# StoriList

A unified cross-medium narrative tracking platform designed for tracking **Anime**, **Comics / Manga**, **Movies**, **Series**, and **Novels** in one cohesive personal library.

---

## Features Implemented

- **Unified Cross-Medium Library**: Track works across five narrative mediums with format-specific progress units (episodes, chapters, runtime minutes, pages).
- **Personal Log & Status Management**: Manage tracking statuses (*Planned*, *In Progress*, *Completed*, *Dropped*), precision decimal ratings (1–10), progress steppers, and personal notes.
- **Dynamic Discovery & Search**: Instant multi-attribute search and filtering across mediums, formats, and genres.
- **Deep-Linked URL State**: Filter and search states in Discover sync seamlessly with browser URL query parameters (`q`, `category`, `genre`, `sort`) with debounced updating, browser history navigation support, and zero scroll jump.
- **Server-Rendered Title Pages**: Server Component title pages featuring dynamic metadata generation, instant skeleton loading states, and robust 404 (`notFound()`) and error handling boundaries.
- **Persistent Local State**: Shared client-side library provider with local storage persistence across routes and modals.
- **Accessible & Responsive Design**: Dark/light theme support, accessible modal dialogs, keyboard navigation (`Escape` closing), and click-outside dismissal.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Getting Started

### Prerequisites

- Node.js 18.17+ or later
- npm (or yarn / pnpm / bun)

### Installation & Run

1. Clone or navigate to the repository:
   ```bash
   cd storilist
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` — Launch the local Turbopack development server.
- `npm run build` — Create an optimized production build.
- `npm run start` — Run the compiled production server.
- `npm run lint` — Run ESLint across the codebase.

---

## Roadmap

- [ ] **Backend & Authentication**: PostgreSQL / SQLite persistence, user accounts, secure authentication sessions, and private library visibility controls.
- [ ] **Real Catalogue Data Integration**: Live external API integrations with AniList (anime/manga), TMDB (movies/series), and Open Library / Google Books (novels).
- [ ] **Stats & Activity Timeline**: Reading and watch velocity tracking, completion timelines, monthly habit streaks, and annual reading/watching wrap-ups.
