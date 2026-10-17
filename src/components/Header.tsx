"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, studio, chapterFor } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { getLenis } from "./SmoothScroll";
import Clock from "./Clock";
import s from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const chapter = chapterFor(pathname);
  const [open, setOpen] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);

  const [hidden, setHidden] = useState(false);

  // Close the menu whenever the route changes.
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
  }

  const [tone, setTone] = useState<"light" | "dark">("light");

  // Hide while reading down, return on any scroll up, and match the tone of the section underneath.
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (Math.abs(y - last) >= 6) {
        setHidden(y > last && y > 240);
        last = y;
      }
      const under = document
        .elementsFromPoint(window.innerWidth / 2, 28)
        .find((el) => !el.closest("header") && !el.closest("#menu"));
      setTone(under?.closest(".dark") ? "dark" : "light");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  useEffect(() => {
    const l = getLenis();
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) l?.stop();
    else l?.start();
  }, [open]);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(overlay.current, { visibility: "visible" })
        .fromTo(overlay.current, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" })
        .from(`.${s.menuItem}`, { yPercent: 110, duration: 0.9, stagger: 0.05, ease: "expo.out" }, "-=0.35")
        .from(`.${s.menuFoot}`, { autoAlpha: 0, duration: 0.6 }, "<0.2");
    },
    { scope: overlay },
  );

  useEffect(() => {
    if (!tl.current) return;
    if (open) tl.current.timeScale(1).play();
    else tl.current.timeScale(1.6).reverse();
  }, [open]);

  return (
    <>
      <header className={[s.header, "t-meta", (tone === "dark" || open) && "dark"].filter(Boolean).join(" ")} data-hidden={hidden && !open}>
        <div className={s.row}>
          <Link href="/" className={s.mark} aria-label="Monark Studio — home">
            Monark<span className={s.markDot}>®</span>
          </Link>

          <span className={s.chapter} aria-hidden>
            {chapter.n} / 05 — {chapter.title}
          </span>

          <nav className={s.nav} aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="link"
                aria-current={pathname === item.href || pathname.startsWith(item.href + "/") ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <span className={s.clock}>
            <span className={s.live} aria-hidden />
            Bhopal <Clock timeZone={studio.timezone} />
          </span>

          <Link href="/contact" className={`${s.cta} link link--static`}>
            Book a call
          </Link>

          <button className={s.burger} onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="menu">
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <div id="menu" ref={overlay} className={`${s.overlay} dark`} aria-hidden={!open}>
        <nav className={s.menu} aria-label="Mobile">
          {[...nav, { href: "/contact", label: "Book a call" }].map((item, i) => (
            <div key={item.href} className={s.menuMask}>
              <Link href={item.href} className={`${s.menuItem} t-h2`} tabIndex={open ? 0 : -1}>
                <span className="t-meta muted">{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </Link>
            </div>
          ))}
        </nav>
        <div className={`${s.menuFoot} t-meta muted`}>
          <a href={`mailto:${studio.email}`} tabIndex={open ? 0 : -1}>{studio.email}</a>
          <span>
            {studio.city} · <Clock timeZone={studio.timezone} />
          </span>
          <span>{studio.availability}</span>
        </div>
      </div>
    </>
  );
}
