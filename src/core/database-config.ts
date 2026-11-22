import type { PoolConfig } from "pg";

/**
 * Turns a connection URL into node-postgres settings.
 *
 * Supabase URLs carry `sslmode=require`, which recent `pg` versions treat as `verify-full`; Supabase
 * certificates are signed by its own CA, so that fails unless the CA is provided. We keep TLS on and
 * verify only when the CA is configured. Pooler-only params that `pg` does not understand are removed.
 */
export function poolConfig(databaseUrl: string, caCert?: string): PoolConfig {
  const url = new URL(databaseUrl);
  const sslmode = url.searchParams.get("sslmode");
  for (const param of ["sslmode", "pgbouncer", "supa", "connection_limit"]) url.searchParams.delete(param);

  const wantsTls = sslmode !== null && sslmode !== "disable";
  const ssl = wantsTls ? (caCert ? { ca: caCert, rejectUnauthorized: true } : { rejectUnauthorized: false }) : undefined;

  return {
    connectionString: url.toString(),
    ...(ssl ? { ssl } : {}),
    // Serverless: few connections per instance; Supabase's pooler does the fan-in.
    max: 3,
    idleTimeoutMillis: 10_000,
  };
}
