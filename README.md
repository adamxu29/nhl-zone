# NHL Zone

A full-stack NHL statistics browser. Browse teams and rosters, view team schedules, and sort
league-wide skater and goalie leaderboards — all built on real data from the NHL's public API.

## Features

- **Home** — hero landing page plus today's games, ordered live → upcoming → final
- **Teams** — all 32 teams grouped by conference and division, with logos
- **Team pages** — record, division rank, upcoming games, full roster, and team statistics
- **Team schedule** — the full season as a single table with scores and Gamecenter links
- **Stat leaders** — skater and goalie leaderboards across nine categories
- **Sortable tables** — full skater and goalie tables with click-to-sort headers, position
  filtering, and adjustable row counts

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (Postgres) |
| Data | [NHL public API](https://github.com/Zmalski/NHL-API-Reference) |

Team and game data is stored in Postgres and seeded by scripts; player stats are fetched live
from the NHL API on each request, so they never go stale.

## Getting started

### 1. Install

```bash
npm install
```

### 2. Set up the database

Create a Supabase project and run `schema.sql` in the SQL editor to create the
`teams`, `games`, and `players` tables and their row-level security policies.

### 3. Environment variables

Create `.env.local` in the project root (no quotes around values):

```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
```

The first two are safe to expose — RLS restricts them to reads. The service role key bypasses
RLS and is only used by the seed scripts, so it must **not** carry the `NEXT_PUBLIC_` prefix.

### 4. Seed the database

Order matters — `games` and `players` both reference `teams`:

```bash
npx tsx --env-file=.env.local scripts/seed-team.ts
npx tsx --env-file=.env.local scripts/seed-games.ts
npx tsx --env-file=.env.local scripts/seed-players.ts
```

All three upsert on conflict, so re-running them is safe.

### 5. Run

```bash
npm run dev
```

## Notes

**Two NHL API domains, two ID systems.** `api-web.nhle.com` supplies teams, games, rosters and
standings; `api.nhle.com/stats/rest` supplies aggregate statistics. All stored IDs come from
`api-web` — mixing sources for foreign keys causes mismatches. The one exception is the stats
API's team summary endpoint, whose `teamId` does align.

**`limit=-1`.** The stats API returns 50 rows by default and silently caps explicit limits at
100. Only `limit=-1` returns a complete result set.

**Dates.** Game dates are stored as plain `YYYY-MM-DD` strings exactly as the API returns them.
Anything comparing against "today" pins the timezone explicitly rather than relying on the
server's locale.

## Roadmap

- Live score updates during games
- Player detail pages
- A separate ML model (Python / scikit-learn) predicting game outcomes, served to this app
  over HTTP
