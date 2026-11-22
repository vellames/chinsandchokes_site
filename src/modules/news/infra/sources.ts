import { z } from "zod";
import type { Source } from "../domain/article";

const sourceSchema = z.object({
  label: z.string().trim().min(1).max(300),
  url: z.url({ protocol: /^https?$/ }),
});

/**
 * Reads the `sources` JSON column, which is typed by hand in the database. Invalid entries are
 * skipped instead of breaking the page.
 */
export function parseSources(value: unknown): Source[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    const parsed = sourceSchema.safeParse(entry);
    return parsed.success ? [parsed.data] : [];
  });
}
