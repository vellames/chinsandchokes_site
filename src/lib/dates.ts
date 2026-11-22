import { site } from "./site";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: site.timeZone,
  month: "short",
  day: "numeric",
  year: "numeric",
});

const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: site.timeZone,
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

/** "Nov 22, 2026" in Eastern Time. */
export function formatDate(date: Date): string {
  return dateFormat.format(date);
}

/** "Nov 22, 2026, 3:05 PM EST". */
export function formatDateTime(date: Date): string {
  return dateTimeFormat.format(date);
}
