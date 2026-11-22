import { describe, expect, it } from "vitest";
import { isValidSlug } from "./slug";

describe("isValidSlug", () => {
  it.each(["news", "ufc-322-results", "a1-b2"])("accepts %s", (slug) => {
    expect(isValidSlug(slug)).toBe(true);
  });

  it.each(["", "News", "double--hyphen", "-start", "end-", "with space", "ação", "a/b"])(
    "rejects %j",
    (slug) => {
      expect(isValidSlug(slug)).toBe(false);
    },
  );

  it("rejects slugs longer than 200 characters", () => {
    expect(isValidSlug("a".repeat(201))).toBe(false);
  });
});
