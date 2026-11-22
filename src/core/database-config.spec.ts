import { describe, expect, it } from "vitest";
import { poolConfig } from "./database-config";

describe("poolConfig", () => {
  it("keeps a plain local URL as is, without TLS", () => {
    const config = poolConfig("postgresql://u:p@localhost:5432/db");
    expect(config.connectionString).toBe("postgresql://u:p@localhost:5432/db");
    expect(config.ssl).toBeUndefined();
  });

  it("turns sslmode=require into encrypted TLS and drops pooler params", () => {
    const config = poolConfig(
      "postgres://u:p@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x&pgbouncer=true",
    );
    expect(config.connectionString).toBe("postgres://u:p@aws-0-us-east-1.pooler.supabase.com:6543/postgres");
    expect(config.ssl).toEqual({ rejectUnauthorized: false });
  });

  it("verifies the certificate when the CA is given", () => {
    const config = poolConfig("postgres://u:p@host/db?sslmode=require", "PEM");
    expect(config.ssl).toEqual({ ca: "PEM", rejectUnauthorized: true });
  });
});
