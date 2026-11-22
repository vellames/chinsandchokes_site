import { describe, expect, it } from "vitest";
import { parseSources } from "./sources";

describe("parseSources", () => {
  it("reads label/url pairs", () => {
    expect(parseSources([{ label: "UFC Stats", url: "https://ufcstats.com" }])).toEqual([
      { label: "UFC Stats", url: "https://ufcstats.com" },
    ]);
  });

  it("skips invalid entries and non-http links", () => {
    expect(
      parseSources([
        { label: "", url: "https://a.com" },
        { label: "No url" },
        { label: "Script", url: "javascript:alert(1)" },
        "text",
        { label: "Ok", url: "http://b.com" },
      ]),
    ).toEqual([{ label: "Ok", url: "http://b.com" }]);
  });

  it("returns nothing for a non-array value", () => {
    expect(parseSources({ label: "x" })).toEqual([]);
    expect(parseSources(null)).toEqual([]);
  });
});
