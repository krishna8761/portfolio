"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { isLowPower } from "@/lib/perf";

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Native scrolling is cheaper and just as smooth on weak machines.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || isLowPower()) return;

    lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
