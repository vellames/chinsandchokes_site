import "server-only";
import { z } from "zod";

/**
 * Server environment, validated once on first use.
 * On Vercel the Supabase integration provides POSTGRES_PRISMA_URL / POSTGRES_URL (pooled);
 * DATABASE_URL wins when set (local development).
 */
const schema = z.object({
  DATABASE_URL: z.url().optional(),
  POSTGRES_PRISMA_URL: z.url().optional(),
  POSTGRES_URL: z.url().optional(),
  /** PEM of the database's CA (Supabase: "Download certificate"). Without it TLS is encrypted but not verified. */
  DATABASE_CA_CERT: z.string().min(1).optional(),
  /** Connections per server instance (default 3; Supabase's pooler does the fan-in). */
  DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(20).optional(),
  /** Shared secret for POST /api/revalidate. The route is disabled when unset. */
  REVALIDATE_SECRET: z.string().min(16).optional(),
});

let cached: (z.infer<typeof schema> & { databaseUrl: string }) | undefined;

export function serverEnv() {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid environment: ${z.prettifyError(parsed.error)}`);
  }
  const databaseUrl = parsed.data.DATABASE_URL ?? parsed.data.POSTGRES_PRISMA_URL ?? parsed.data.POSTGRES_URL;
  if (!databaseUrl) {
    throw new Error("Missing database URL: set DATABASE_URL (or connect Supabase on Vercel).");
  }
  cached = { ...parsed.data, databaseUrl };
  return cached;
}
