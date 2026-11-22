import { describe, expect, it } from "vitest";
import { readingMinutes } from "./reading-time";

describe("readingMinutes", () => {
  it("is at least one minute", () => {
    expect(readingMinutes("Short.")).toBe(1);
  });

  it("counts about 230 words per minute", () => {
    expect(readingMinutes("word ".repeat(690))).toBe(3);
  });

  it("ignores Markdown syntax, image markup and link targets", () => {
    const body = `## Heading\n\n![alt text](https://example.com/a.jpg)\n[two words](https://example.com/very/long/url)`;
    expect(readingMinutes(body)).toBe(1);
  });
});
