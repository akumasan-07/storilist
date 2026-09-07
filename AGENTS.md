<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# StoriList Development Guidelines

## Project Overview

StoriList is a full-stack media tracking application that provides a unified personal library for anime, comics, movies, series, and novels.

Users can discover media, track progress, manage statuses, rate and favorite media, write personal notes, and eventually import libraries from external services.

## Core Development Principles

- Use TypeScript throughout the project.
- Use Next.js App Router and follow current Next.js conventions.
- Prefer simple, maintainable solutions over unnecessary abstraction.
- Do not introduce a dependency unless it provides clear value.
- Do not add features merely to increase technical complexity.
- Keep the application portfolio-worthy while maintaining a realistic, understandable architecture.
- Prioritize completing the MVP quickly without compromising important functionality or security.
- Code should be understandable and explainable by a developer familiar with the project.

## Architecture

- Keep the application as a single Next.js project.
- Use Server Components by default and Client Components only when interactivity requires them.
- Use Server Actions for appropriate server-side mutations.
- Use Route Handlers only when an HTTP endpoint is actually required.
- Keep database access on the server.
- Keep external API integrations isolated from UI components.
- Treat StoriList's database as the application's internal source of stored media data rather than depending on external APIs for every request.

## Data Model

Top-level media types:

- ANIME
- COMIC
- MOVIE
- SERIES
- NOVEL

Comic formats:

- MANGA
- MANHWA
- MANHUA
- WESTERN_COMIC

Novel formats:

- NOVEL
- LIGHT_NOVEL
- WEB_NOVEL

Each media item has one authoritative external source.

Ratings consist of:

- Source Rating — rating provided by the external media source.
- SL Rating — aggregate rating submitted by StoriList users.

Do not combine ratings from multiple external providers.

## Security

Implement practical security appropriate for a production MVP:

- Hash passwords securely.
- Protect authenticated resources.
- Verify resource ownership before mutations.
- Validate untrusted input on the server.
- Never expose secrets or credentials to the client.
- Use secure authentication/session practices.
- Handle errors without exposing sensitive implementation details.
- Follow common OWASP web security practices where applicable.

Do not over-engineer security beyond what is appropriate for the application's scale.

## Dependencies

Avoid unnecessary libraries.

Currently preferred core technologies:

- Next.js
- React
- TypeScript
- Tailwind CSS
- MongoDB
- Mongoose
- Auth.js

Additional dependencies should be proposed first when they are not clearly necessary.

## Scope Control

The initial goal is a functional MVP that can be deployed within approximately one week.

Do not implement:

- Unrequested features
- Major architectural changes
- Additional external services
- New dependencies
- Significant refactors

unless they are explicitly approved.

## Proactive Suggestions

You are encouraged to identify:

- Better implementation approaches
- Useful features
- Security concerns
- Performance improvements
- UX improvements
- Refactoring opportunities
- Potential architectural problems
- Relevant modern development practices

However:

**Do not implement any unrequested suggestion automatically.**

After completing the requested task, present applicable suggestions separately and briefly explain their benefit and tradeoffs.

The developer will decide which suggestions to accept or discard. Only implement approved suggestions.

## Development Workflow

For each task:

1. Understand the existing code before modifying it.
2. Implement only the requested changes.
3. Preserve existing functionality.
4. Run relevant checks/tests after making changes.
5. Report what was changed and whether verification succeeded.
6. Present optional improvements separately.
7. Wait for approval before implementing optional improvements.

If a requested approach is technically problematic, explain the issue and recommend a better alternative rather than blindly following it.