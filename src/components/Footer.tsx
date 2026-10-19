"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, studio, nextChapterFor, legalLinks } from "@/content/site";
import Clock from "./Clock";
import s from "./Footer.module.css";

export default function Footer() {
  const pathname = usePathname();
  const next = nextChapterFor(pathname);

  return (
    <footer className={`${s.footer} dark`}>
      {next && (
        <Link href={next.href} className={`${s.next} wrap`}>
          <span className="t-meta muted">Next — {next.n}</span>
          <span className={`${s.nextTitle} t-mega`}>
            {next.title}
            <span className={`${s.nextArrow} arrow`} aria-hidden>
              →
            </span>
          </span>
        </Link>
      )}

      <div className={`${s.base} wrap grid t-meta`}>
        <div className={s.col}>
          <span className="muted">Monark Studio</span>
          <p className={s.statement}>
            Systems, platforms and brands for businesses that would rather be working on the business.
          </p>
        </div>

        <div className={s.col}>
          <span className="muted">Pages</span>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="link">
              {n.label}
            </Link>
          ))}
        </div>

        <div className={s.col}>
          <span className="muted">Contact</span>
          <a href={`mailto:${studio.email}`} className={`link ${s.email}`}>
            {studio.email}
          </a>
          {studio.social.map((x) => (
            <a key={x.label} href={x.href} className="link" target="_blank" rel="noreferrer">
              {x.label}
            </a>
          ))}
        </div>

        <div className={s.col}>
          <span className="muted">Studio</span>
          <span>{studio.city}</span>
          <span>
            <Clock timeZone={studio.timezone} /> IST
          </span>
        </div>

        <div className={`${s.legal} muted`}>
          <span>© {studio.founded} Monark Studio</span>
          <span className={s.legalLinks}>
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="link">
                {l.label}
              </Link>
            ))}
            <span>Fees in USD</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
