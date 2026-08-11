import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  serverExternalPackages: ["better-sqlite3"],
  images: {
    remotePatterns: [
      // Supabase storage — fill in your project ref once provisioned
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
