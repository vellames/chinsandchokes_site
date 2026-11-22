/**
 * Hosts whose images go through Next's image optimizer (configured in next.config.ts).
 * Others are shown as plain <img> so a cover typed by hand from any site never breaks a page.
 * Add hosts with IMAGE_HOSTS (comma-separated) — wildcards like "*.example.com" work.
 */
export const DEFAULT_IMAGE_HOSTS = ["*.supabase.co", "upload.wikimedia.org", "images.unsplash.com"];

export function imageHosts(): string[] {
  const extra = (process.env["IMAGE_HOSTS"] ?? "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set([...DEFAULT_IMAGE_HOSTS, ...extra])];
}

export function isOptimizable(src: string, hosts: readonly string[] = imageHosts()): boolean {
  if (src.startsWith("/")) return true;
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return false;
  }
  if (url.protocol !== "https:") return false;
  const host = url.hostname.toLowerCase();
  return hosts.some((pattern) =>
    pattern.startsWith("*.") ? host.endsWith(pattern.slice(1)) : host === pattern,
  );
}
