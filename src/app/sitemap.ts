import type { MetadataRoute } from "next";
import { projects } from "@/content/site";
import { abs } from "@/lib/seo";

// Bump when content meaningfully changes; search engines use it to decide what to re-crawl.
const UPDATED = new Date("2026-10-18");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/work", priority: 0.9, changeFrequency: "weekly" },
    { path: "/capabilities", priority: 0.8, changeFrequency: "monthly" },
    { path: "/process", priority: 0.7, changeFrequency: "monthly" },
    { path: "/engagements", priority: 0.8, changeFrequency: "monthly" },
    { path: "/studio", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.9, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.3, changeFrequency: "monthly" },
  ];
  return [
    ...routes.map((r) => ({ url: abs(r.path), lastModified: UPDATED, changeFrequency: r.changeFrequency, priority: r.priority })),
    ...projects.map((p) => ({
      url: abs(`/work/${p.slug}`),
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      ...(p.media.kind === "video" ? { images: [abs(`/work/thumb/${p.media.slug}-desktop.jpg`)] } : {}),
    })),
  ];
}
