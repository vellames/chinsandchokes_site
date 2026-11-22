import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { serverEnv } from "@/core/env";
import { NEWS_CACHE_TAG } from "@/modules/news";

/**
 * POST /api/revalidate with `Authorization: Bearer <REVALIDATE_SECRET>`: shows database edits
 * right away instead of within about a minute. Disabled (404) when the secret is not configured.
 */
export async function POST(request: Request) {
  const secret = serverEnv().REVALIDATE_SECRET;
  if (!secret) return new Response("Not found", { status: 404 });

  const given = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
  if (!safeEqual(given, secret)) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });

  revalidateTag(NEWS_CACHE_TAG, "max");
  return Response.json({ revalidated: true });
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
