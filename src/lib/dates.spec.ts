import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime } from "./dates";

describe("dates", () => {
  it("shows the Eastern Time calendar day, not the UTC one", () => {
    // 02:00 UTC on Nov 23 is still Nov 22 in New York.
    expect(formatDate(new Date("2026-11-23T02:00:00Z"))).toBe("Nov 22, 2026");
  });

  it("labels the time zone", () => {
    expect(formatDateTime(new Date("2026-11-22T20:05:00Z"))).toBe("Nov 22, 2026, 3:05 PM EST");
  });
});
