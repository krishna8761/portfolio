import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  agentRules: false, // no auto-generated helper files in the project root
  partialPrefetching: true,

  images: {
    // Served as AVIF where the browser supports it, WebP otherwise; JPEG is only the source file.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  // Old static-site URLs go straight to their new home in one hop — never through a chain.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index", destination: "/", permanent: true },
      { source: "/pages/:path*", destination: "/", permanent: true },
      { source: "/portfolio", destination: "/work", permanent: true },
      { source: "/projects", destination: "/work", permanent: true },
      { source: "/services", destination: "/capabilities", permanent: true },
      { source: "/pricing", destination: "/engagements", permanent: true },
      { source: "/about", destination: "/studio", permanent: true },
      { source: "/start", destination: "/contact", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        // Long-lived, but not immutable: thumbnails may be replaced at the same path.
        source: "/work/:dir(video|thumb)/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
