# Chins & Chokes — site

News portal for Chins & Chokes. Next.js 16 (App Router, Cache Components) + TypeScript, Postgres
through Prisma 7, hosted on Vercel with Supabase Postgres. No back office yet: content is typed
straight into the database.

## Run locally

```bash
cp .env.example .env.local   # then point DATABASE_URL at a Postgres
npm install                  # also generates the Prisma client
npm run db:migrate           # apply migrations
npm run db:seed-dev          # optional: sample rows (local only, needs psql)
npm run dev
```

No Postgres at hand? A throwaway one in WASM works:
`npx @electric-sql/pglite-socket --db=./pgdata --port=54329 --max-connections=10`
(DATABASE_URL `postgresql://postgres:postgres@127.0.0.1:54329/postgres?sslmode=disable`).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run check` | Lint, typecheck, unit tests and production build |
| `npm test` | Unit tests (Vitest) |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:migration -- --name <name>` | Create a migration from schema changes (review the SQL) |
| `npm run db:seed-dev` | Load `prisma/seed-dev.sql` (never in production) |
| `npm run db:studio` | Prisma Studio, a quick table editor |

## Deploy (Vercel + Supabase)

1. Import `vellames/chinsandchokes_site` in Vercel (Root Directory: the repo root, the default).
2. Storage → connect **Supabase**. It sets `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, etc.
3. Set `NEXT_PUBLIC_SITE_URL` (the public domain) and optionally `REVALIDATE_SECRET`.
4. Deploy. `vercel-build` runs `prisma migrate deploy` (direct connection) and then `next build`.

Preview deployments migrate the same database as production unless you give previews their own
Supabase branch/database.

## Adding content

See [AGENTS.md](AGENTS.md#adding-content-by-hand). Edits show up within about a minute, or at once
with:

```bash
curl -X POST -H "Authorization: Bearer $REVALIDATE_SECRET" https://<domain>/api/revalidate
```
