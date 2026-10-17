"use client";

import { useEffect, useRef } from "react";
import { getImageProps } from "next/image";
import { isLowPower } from "@/lib/perf";

type Props = { slug: string; variant: "desktop" | "mobile"; label: string; className?: string };

/**
 * Silent screen recording of a live site. Loads nothing until it nears the viewport,
 * plays only while visible, and stays on its poster frame for reduced-motion users.
 */
export default function SiteVideo({ slug, variant, label, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const base = `/work/video/${slug}-${variant}`;
  // Route the poster through the image optimizer so it arrives as AVIF/WebP at a sensible size.
  const poster = getImageProps({
    src: `/work/thumb/${slug}-${variant}.jpg`,
    alt: "",
    width: variant === "desktop" ? 1600 : 720,
    height: variant === "desktop" ? 900 : 1558,
    sizes: variant === "desktop" ? "100vw" : "50vw",
  }).props.src;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Reduced motion or a weak machine: the poster frame is the whole experience.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || isLowPower()) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (v.preload === "none") v.preload = "auto";
          v.play().catch(() => {});
        } else v.pause();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      disablePictureInPicture
    >
      <source src={`${base}.mp4`} type="video/mp4" />
    </video>
  );
}
