import type { Metadata } from "next";
import Link from "next/link";
import Label from "@/components/Label";
import { engagements, terms } from "@/content/site";
import s from "./engagements.module.css";
import Motion from "@/components/Motion";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = pageMeta({
  title: "Engagements",
  description:
    "Monark Studio pricing in USD: a $750 Diagnostic, fixed-price builds from $2,500 and monthly partnerships. Every price agreed before work starts.",
  path: "/engagements",
});

export default function Engagements() {
  return (
    <>
      <section className={`${s.top} wrap`}>
        <Breadcrumbs trail={[{ name: "Engagements", path: "/engagements" }]} />
        <h1 className={`${s.title} t-display`} data-lines>
          Three ways in. Every price <span className="t-serif">agreed up front.</span>
        </h1>
        <p className={`${s.intro} t-lead`} data-fade>
          No hourly billing and no open-ended retainers. You know the cost of each stage before it starts. All fees are in
          US dollars.
        </p>
      </section>

      <section className="wrap">
        {engagements.map((e) => (
          <article key={e.n} className={`${s.row} grid`}>
            <div className={`${s.rule} rule`} data-rule />
            <span className={`${s.n} t-meta muted`}>{e.n}</span>
            <h2 className={`${s.name} t-h2`} data-lines>
              {e.title}
            </h2>
            <div className={s.price} data-fade>
              <span className={`${s.amount} t-h2`}>{e.price}</span>
              <span className="t-meta muted">{e.unit}</span>
            </div>
            <div className={s.body} data-fade>
              <p className="measure">{e.note}</p>
              <ul className={`${s.includes} t-meta`}>
                {e.includes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
        <div className={`${s.cta}`} data-fade>
          <p className="muted measure">
            Not sure which fits? Most clients start with the Diagnostic. It answers the question for you, and the fee is
            credited if you go ahead.
          </p>
          <Link href="/contact" className="btn">
            Start with a diagnostic <span className="arrow">→</span>
          </Link>
        </div>
      </section>

      <section className={`${s.terms} section wrap grid`}>
        <Label n="—" className={s.termsLabel}>Terms, plainly</Label>
        <div className={s.faq}>
          {terms.map((t) => (
            <details key={t.q} className={s.item} data-fade>
              <summary className={`${s.q} t-h3`}>
                {t.q}
                <span className={s.plus} aria-hidden />
              </summary>
              <p className={`${s.a} muted measure`}>{t.a}</p>
            </details>
          ))}
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: terms.map((t) => ({ "@type": "Question", name: t.q, acceptedAnswer: { "@type": "Answer", text: t.a } })),
        }}
      />
      <Motion />
    </>
  );
}
