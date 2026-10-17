"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import s from "./PhotoStrip.module.css";

export type StripItem = {
  src: string;
  alt: string;
  caption: string;
  meta: string;
  ratio: number; // width / height of the frame
  href?: string;
};

/**
 * An endless, slowly drifting row of images with mono captions (after onseis.com).
 * Slows to a crawl on hover; with reduced motion it becomes a plain swipeable row.
 */
export default function PhotoStrip({ items }: { items: StripItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = track.current!;
        // The list is rendered twice, so sliding by half its width loops seamlessly.
        const tween = gsap.to(el, { xPercent: -50, duration: items.length * 3.5, ease: "none", repeat: -1 });

        const slow = () => gsap.to(tween, { timeScale: 0.15, duration: 0.8, ease: "power2.out" });
        const go = () => gsap.to(tween, { timeScale: 1, duration: 0.8, ease: "power2.inOut" });
        el.addEventListener("pointerenter", slow);
        el.addEventListener("pointerleave", go);

        // Don't spend frames on it while it's off screen.
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tween.play() : tween.pause()));
        io.observe(root.current!);

        gsap.from(`.${s.item}`, { autoAlpha: 0, y: 40, duration: 1.2, stagger: 0.06, ease: "expo.out", delay: 0.5 });

        return () => {
          io.disconnect();
          el.removeEventListener("pointerenter", slow);
          el.removeEventListener("pointerleave", go);
        };
      });
    },
    { scope: root },
  );

  const row = [...items, ...items];

  return (
    <div ref={root} className={s.strip} aria-label="Selected images">
      <div ref={track} className={s.track}>
        {row.map((it, i) => {
          const dup = i >= items.length;
          const body = (
            <>
              <div className={`${s.frame} media`} style={{ aspectRatio: it.ratio }}>
                <Image src={it.src} alt={dup ? "" : it.alt} fill sizes="(min-width: 900px) 18vw, 50vw" />
              </div>
              <p className={`${s.cap} t-meta`}>
                {it.caption} <span aria-hidden>•</span> <span className="muted">{it.meta}</span>
              </p>
            </>
          );
          return it.href ? (
            <Link key={i} href={it.href} className={s.item} aria-hidden={dup || undefined} tabIndex={dup ? -1 : undefined}>
              {body}
            </Link>
          ) : (
            <figure key={i} className={s.item} aria-hidden={dup || undefined}>
              {body}
            </figure>
          );
        })}
      </div>
    </div>
  );
}
