import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Sets up D1/KV/R2 bindings during `next dev` via wrangler's getPlatformProxy.
// Intentionally not awaited — the function handles its own async init.
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  distDir: process.env.E4S_NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
