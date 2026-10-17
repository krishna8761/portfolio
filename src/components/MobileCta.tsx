"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Phone-only bar that offers the one CTA once the visitor has read enough to care. */
export default function MobileCta() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setShown(p > 0.25 && p < 0.9);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (pathname === "/contact") return null;

  return (
    <Link href="/contact" className="mobile-cta btn" data-shown={shown} tabIndex={shown ? 0 : -1} aria-hidden={!shown}>
      <span>Book a 20-min call</span>
      <span className="arrow" aria-hidden>
        →
      </span>
    </Link>
  );
}
