import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The /admin draft actions read content/ files at request time on Vercel.
  outputFileTracingIncludes: {
    "/api/admin/drafts": ["./content/**/*"],
    "/admin": ["./content/**/*"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.zyrosite.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async headers() {
    return [
      {
        // Make machine-readable surfaces explicitly cacheable + typed for AI crawlers
        source: "/:path*.md",
        headers: [{ key: "Content-Type", value: "text/markdown; charset=utf-8" }],
      },
    ];
  },
};

export default nextConfig;
