import type { NextConfig } from "next";

/** Set in CI for GitHub Pages project sites, e.g. `/globe`. Empty for local dev. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/w80/**",
      },
    ],
  },
};

export default nextConfig;
