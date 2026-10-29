"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION_OK, DESKTOP } from "@/lib/gsap";
import { isLowPower } from "@/lib/perf";
import { takeIntroDelay } from "@/lib/intro";

/**
 * Rendered at the end of every page. Because it lives inside the page segment, its
 * effect only runs once that page has hydrated — so SplitText never rewrites HTML
 * React hasn't claimed yet. It animates anything in <main> that opts in with:
 *
 *   data-lines     split into masked lines that rise in
 *   data-fade      fade + lift (data-fade="stagger" staggers its children)
 *   data-img       clip-path reveal with the inner <img> settling from 1.15
 *   data-parallax  inner <img> drifts on scroll (desktop only)
 *   data-rule      hairline draws from the left
 *   data-count     number counts up once (reads the element's text)
 */
export default function Motion() {
  const marker = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = marker.current!.closest("main")!;
      const q = <T extends Element = HTMLElement>(s: string) => gsap.utils.toArray<T>(s, el);
      const mm = gsap.matchMedia();
      // On first load the intro covers the page; hold the page reveal until it lifts.
      const wait = takeIntroDelay();

      mm.add(
        { motion: MOTION_OK, desktop: DESKTOP, reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const { motion, desktop } = ctx.conditions as Record<string, boolean>;

          if (!motion) {
            gsap.set(q("[data-lines], [data-fade]"), { autoAlpha: 1 });
            return;
          }

          const k = desktop ? 1 : 0.7; // shorter on phones
          // Weak machines: no scrubbed parallax, no clip-path repaints — images just fade in.
          const lp = isLowPower();
          // Anything already in view on load plays as the page intro.
          const inView = (t: Element) => t.getBoundingClientRect().top < window.innerHeight * 0.92;

          // Page enter
          gsap.fromTo(el, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8 * k, delay: wait, ease: "power3.out" });

          q("[data-lines]").forEach((node) => {
            const delay = Number(node.dataset.delay ?? 0);
            SplitText.create(node, {
              type: "lines",
              mask: "lines",
              linesClass: "line",
              autoSplit: true,
              onSplit(self) {
                gsap.set(node, { autoAlpha: 1 });
                return gsap.from(self.lines, {
                  yPercent: 110,
                  duration: 1.1 * k,
                  stagger: 0.07,
                  delay: inView(node) ? wait + 0.15 + delay : 0,
                  scrollTrigger: inView(node) ? undefined : { trigger: node, start: "top 88%", once: true },
                });
              },
            });
          });

          q("[data-fade]").forEach((node) => {
            const targets = node.dataset.fade === "stagger" ? Array.from(node.children) : [node];
            gsap.set(node, { autoAlpha: 1 });
            gsap.from(targets, {
              autoAlpha: 0,
              y: 20,
              duration: 0.9 * k,
              stagger: 0.08,
              delay: inView(node) ? wait + 0.35 + Number(node.dataset.delay ?? 0) : 0,
              scrollTrigger: inView(node) ? undefined : { trigger: node, start: "top 90%", once: true },
            });
          });

          q("[data-img]").forEach((node) => {
            if (lp) {
              gsap.from(node, {
                autoAlpha: 0,
                duration: 0.6,
                scrollTrigger: inView(node) ? undefined : { trigger: node, start: "top 92%", once: true },
              });
              return;
            }
            const img = node.querySelector("img, video");
            const tl = gsap.timeline({
              delay: inView(node) ? wait + 0.2 : 0,
              scrollTrigger: inView(node) ? undefined : { trigger: node, start: "top 90%", once: true },
            });
            tl.fromTo(node, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4 * k, ease: "expo.inOut" });
            // Parallax images rest slightly overscaled so their drift never shows an edge.
            const rest = desktop && node.hasAttribute("data-parallax") ? 1.06 : 1;
            if (img) tl.fromTo(img, { scale: rest + 0.15 }, { scale: rest, duration: 1.6 * k, ease: "expo.out" }, "<0.15");
          });

          if (desktop && !lp) {
            q("[data-parallax]").forEach((node) => {
              const img = node.querySelector("img, video");
              if (!img) return;
              if (!node.hasAttribute("data-img")) gsap.set(img, { scale: 1.06 });
              gsap.fromTo(img, { yPercent: -2.5 }, {
                yPercent: 2.5,
                ease: "none",
                scrollTrigger: { trigger: node, start: "top bottom", end: "bottom top", scrub: true },
              });
            });
          }

          q("[data-rule]").forEach((node) => {
            gsap.from(node, {
              scaleX: 0,
              duration: 1.4 * k,
              ease: "expo.inOut",
              scrollTrigger: { trigger: node, start: "top 95%", once: true },
            });
          });

          q("[data-count]").forEach((node) => {
            // Cache the real value so a re-run (StrictMode, HMR) never reads a half-counted number.
            const raw = (node.dataset.target ??= node.textContent ?? "");
            const m = raw.match(/^(\D*)(\d+)(.*)$/);
            if (!m) return;
            const [, pre, num, post] = m;
            const obj = { v: 0 };
            gsap.to(obj, {
              v: Number(num),
              duration: 1.6,
              ease: "power2.out",
              scrollTrigger: { trigger: node, start: "top 90%", once: true },
              onUpdate: () => (node.textContent = `${pre}${Math.round(obj.v)}${post}`),
            });
            ctx.add(() => () => (node.textContent = raw));
          });

          // Late-loading images can shift positions; recalc once everything is in.
          const onLoad = () => ScrollTrigger.refresh();
          window.addEventListener("load", onLoad, { once: true });
          return () => window.removeEventListener("load", onLoad);
        },
      );

      document.documentElement.classList.remove("js-motion");
    },
    { dependencies: [] },
  );

  return <span ref={marker} hidden />;
}
