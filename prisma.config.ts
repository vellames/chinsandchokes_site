import "dotenv/config";
import { defineConfig } from "prisma/config";

// Migrations need a direct (non-pooled) connection. On Vercel + Supabase that is
// POSTGRES_URL_NON_POOLING; locally, DATABASE_URL is enough.
// `prisma generate` needs no database, so the URL is optional here.
const databaseUrl =
  process.env["MIGRATION_DATABASE_URL"] ??
  process.env["POSTGRES_URL_NON_POOLING"] ??
  process.env["DATABASE_URL"];

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  ...(databaseUrl ? { datasource: { url: databaseUrl } } : {}),
});
