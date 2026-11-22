import { describe, expect, it } from "vitest";
import { MAX_PAGE, pageCount, parsePageNumber } from "./pagination";

describe("parsePageNumber", () => {
  it("defaults to page 1 when absent", () => {
    expect(parsePageNumber(undefined)).toBe(1);
  });

  it("reads whole numbers", () => {
    expect(parsePageNumber("3")).toBe(3);
  });

  it.each(["0", "-1", "1.5", "abc", "01", "", String(MAX_PAGE + 1)])("rejects %j", (raw) => {
    expect(parsePageNumber(raw)).toBeNull();
  });

  it("rejects repeated parameters", () => {
    expect(parsePageNumber(["1", "2"])).toBeNull();
  });
});

describe("pageCount", () => {
  it("is at least 1, even with no items", () => {
    expect(pageCount(0, 12)).toBe(1);
  });

  it("rounds up", () => {
    expect(pageCount(25, 12)).toBe(3);
  });
});
