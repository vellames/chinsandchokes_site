<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Chins & Chokes site

Public news portal. Audience-facing copy is English and written for Alex (`../persona/guideline.md`);
the look follows `../workspace/brand/visual.md` and `../visual-identity/brand-board-en.jpg`.

## Architecture

A single Next.js app (monolith), organized like the finance project's API but without tenants:

```
src/
  app/                  routes only: read params, call a module, render components
  modules/<feature>/    one folder per feature (today: news)
    domain/             pure types and rules (no I/O, no framework)
    application/        use cases + ports (interfaces they depend on)
    infra/              adapters for the ports (Prisma)
    testing/            in-memory doubles for the ports
    index.ts            composition root + cache boundary ('use cache', cacheTag 'news')
  core/                 env validation (Zod), Prisma client, database settings
  components/           atoms → molecules → organisms → templates
  lib/                  small framework-free helpers (site config, dates, image hosts)
  generated/prisma/     generated client (git-ignored, `postinstall` regenerates it)
```

Rules:

- Dependencies point inward: `app` → `modules/*/index.ts` → `application` → `domain`. Routes and
  components never import Prisma or `infra/` directly.
- Strict TypeScript, no `any`. Validate anything typed by hand (env, JSON columns) with Zod.
- Tests next to the code (`*.spec.ts`, Vitest). New use cases get tests against the in-memory repository.
- Cache Components is on. Data reads go through the cached functions in `modules/news/index.ts`;
  pages that read `params`/`searchParams` do it inside `<Suspense>`; dynamic routes need
  `generateStaticParams` with at least one entry.
- `npm run check` must pass before a change is done; then look at the touched pages in the browser.

## Database

- Tables PascalCase, columns camelCase, ids UUID (`gen_random_uuid()`), every instant `timestamptz`,
  every table has `createdAt`/`updatedAt` (a trigger keeps `updatedAt` current on manual edits).
- Schema changes: edit `prisma/schema.prisma`, run `npm run db:migration -- --name <name>`, review
  the SQL, commit it. Never edit an applied migration.
- RLS is enabled with no policies so Supabase's REST API (anon key) cannot read or write the
  tables. The app connects as the owner. Add policies only on purpose.
- CHECK constraints guard hand-typed rows: slug format, published needs `publishedAt`, non-blank
  title/dek/body, `sources` is a JSON array.

## Adding content by hand

An article is visible when `status = 'published'` and `publishedAt <= now()`; a future
`publishedAt` schedules it. `featured = true` puts it in the home page lead slot (newest featured
wins; otherwise the newest article leads).

```sql
INSERT INTO "Article" ("slug", "title", "dek", "body", "status", "publishedAt", "categoryId",
                       "coverImageUrl", "coverImageAlt", "coverImageCredit", "sources")
VALUES (
  'ufc-example-story',                       -- lowercase, digits, single hyphens
  'Headline the hook promises',
  'One line: what Alex will understand after reading.',
  E'Markdown body.\n\n## Subheading\n\nText.',
  'published', now(),
  (SELECT id FROM "Category" WHERE slug = 'news'),
  'https://<store>.public.blob.vercel-storage.com/covers/photo.jpg',
  'What the photo shows',
  'Photo: Name / License',
  '[{"label": "UFC Stats", "url": "https://ufcstats.com"}]'
);
```

- Video: set `youtubeVideoId` (the 11-character id) and `videoOrientation` (`portrait` for a
  Short, `landscape` otherwise); the player replaces the cover at the top of the article.
- Sources: `[{"label": "...", "url": "https://..."}]`; `url` may be omitted for offline sources.
- Body is Markdown (GFM tables, lists, quotes). Raw HTML is ignored. A Markdown `#` heading becomes
  an `h2` (the page has its own `h1`).
- Covers: licensed or own images only (see `../workspace/brand/do-dont.md`); always fill
  `coverImageAlt` and `coverImageCredit`. Upload them to the public Vercel Blob store
  `storage-chinsandchokes-public` (Vercel → Storage, e.g. a `covers/` folder) and paste the file URL
  into `coverImageUrl`. Hosts in `src/lib/images.ts` (plus `IMAGE_HOSTS`) are
  optimized by next/image; other hosts still work as plain images.
- Categories with a `position` appear in the navigation, ordered by it.
- Tags: insert into `"Tag"`, then link with `"ArticleTag" ("articleId", "tagId")`.
- `prisma/seed-dev.sql` is a working example of every table.
