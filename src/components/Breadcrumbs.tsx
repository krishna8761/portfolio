import Link from "next/link";
import { abs } from "@/lib/seo";
import JsonLd from "./JsonLd";
import s from "./Breadcrumbs.module.css";

type Crumb = { name: string; path: string };

/** Visible trail plus matching BreadcrumbList schema. "Home" is added automatically. */
export default function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const all = [{ name: "Home", path: "/" }, ...trail];
  return (
    <>
      <nav aria-label="Breadcrumb" className={`${s.crumbs} t-meta`} data-fade>
        <ol>
          {all.map((c, i) => (
            <li key={c.path}>
              {i < all.length - 1 ? (
                <Link href={c.path} className="link muted">
                  {c.name}
                </Link>
              ) : (
                <span aria-current="page">{c.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })),
        }}
      />
    </>
  );
}
