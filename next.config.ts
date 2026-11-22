import type { NextConfig } from "next";
import { imageHosts } from "./src/lib/images";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: imageHosts().map((hostname) => ({ protocol: "https" as const, hostname: hostname.replace(/^\*\./, "**.") })),
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
