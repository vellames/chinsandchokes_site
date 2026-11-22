import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { poolConfig } from "./database-config";
import { serverEnv } from "./env";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** One Prisma client per server instance (reused across hot reloads in development). */
export function db(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const env = serverEnv();
    globalForPrisma.prisma = new PrismaClient({
      adapter: new PrismaPg(poolConfig(env.databaseUrl, env.DATABASE_CA_CERT)),
    });
  }
  return globalForPrisma.prisma;
}
