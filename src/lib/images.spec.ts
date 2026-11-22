import { describe, expect, it } from "vitest";
import { isOptimizable } from "./images";

const hosts = ["*.supabase.co", "upload.wikimedia.org"];

describe("isOptimizable", () => {
  it.each([
    "/brand/og-default.jpg",
    "https://abc.supabase.co/storage/v1/object/public/covers/a.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/a/ab/x.jpg",
  ])("accepts %s", (src) => {
    expect(isOptimizable(src, hosts)).toBe(true);
  });

  it.each([
    "https://example.com/a.jpg",
    "http://upload.wikimedia.org/x.jpg",
    "https://supabase.co.evil.com/a.jpg",
    "not a url",
  ])("rejects %s", (src) => {
    expect(isOptimizable(src, hosts)).toBe(false);
  });
});
