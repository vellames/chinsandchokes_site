import { describe, expect, it } from "vitest";
import { parseSources } from "./sources";

describe("parseSources", () => {
  it("reads label/url pairs", () => {
    expect(parseSources([{ label: "UFC Stats", url: "https://ufcstats.com" }])).toEqual([
      { label: "UFC Stats", url: "https://ufcstats.com" },
    ]);
  });

  it("keeps sources without a link", () => {
    expect(parseSources([{ label: "UFC 1 broadcast" }, { label: "Book", url: null }])).toEqual([
      { label: "UFC 1 broadcast", url: null },
      { label: "Book", url: null },
    ]);
  });

  it("skips invalid entries and non-http links", () => {
    expect(
      parseSources([
        { label: "", url: "https://a.com" },
        { label: "Script", url: "javascript:alert(1)" },
        "text",
        { label: "Ok", url: "http://b.com" },
      ]),
    ).toEqual([{ label: "Ok", url: "http://b.com" }]);
  });

  it("drops an invalid link instead of showing it", () => {
    expect(parseSources([{ label: "Bad", url: "not a url" }])).toEqual([]);
  });

  it("returns nothing for a non-array value", () => {
    expect(parseSources({ label: "x" })).toEqual([]);
    expect(parseSources(null)).toEqual([]);
  });
});
