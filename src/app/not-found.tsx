import Link from "next/link";
import Motion from "@/components/Motion";
import { nav } from "@/content/site";
import s from "./not-found.module.css";

export const metadata = { title: "Page not found", robots: { index: false, follow: true } };

// Next.js answers this page with a real 404 status and a noindex tag, so it never enters search results.
export default function NotFound() {
  return (
    <section className={`${s.page} wrap`}>
      <p className="t-meta muted" data-fade>
        Error 404
      </p>
      <h1 className={`${s.title} t-mega`} data-lines>
        Not here.
      </h1>
      <p className={`${s.copy} t-lead`} data-fade>
        The page you were after has moved or never existed. One of these will get you back on track.
      </p>
      <ul className={`${s.links} t-h3`} data-fade="stagger">
        <li>
          <Link href="/" className="link">
            Home
          </Link>
        </li>
        {nav.map((n) => (
          <li key={n.href}>
            <Link href={n.href} className="link">
              {n.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/contact" className="link">
            Book a call
          </Link>
        </li>
      </ul>
      <Motion />
    </section>
  );
}
