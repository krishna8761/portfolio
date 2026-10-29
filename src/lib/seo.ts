import type { Metadata } from "next";
import { studio } from "@/content/site";

/** Production origin. Set NEXT_PUBLIC_SITE_URL if the site moves (no trailing slash). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://monarkstudio.in").replace(/\/$/, "");

export const abs = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

/**
 * Per-page metadata with a canonical URL and matching Open Graph / Twitter tags,
 * so every page tells search engines exactly one address for itself.
 */
export function pageMeta({
  title,
  description,
  path,
  image,
}: {
  title?: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = abs(path);
  const ogTitle = title ? `${title} — ${studio.name}` : `${studio.name} — Custom systems for leads, follow-up & automation`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: studio.name,
      title: ogTitle,
      description,
      locale: "en_US",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, ...(image ? { images: [image] } : {}) },
  };
}
