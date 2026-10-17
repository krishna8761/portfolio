import type { Metadata } from "next";
import Link from "next/link";
import Label from "@/components/Label";
import { practices, automatable } from "@/content/site";
import s from "./capabilities.module.css";
import Motion from "@/components/Motion";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = pageMeta({
  title: "Capabilities",
  description:
    "Operations and automation, digital platforms, brand and interface — plus twelve everyday tasks your business can stop doing by hand.",
  path: "/capabilities",
});

export default function Capabilities() {
  const total = automatable.reduce((sum, a) => sum + Number(a.hours), 0);

  return (
    <>
      <section className={`${s.top} wrap`}>
        <Breadcrumbs trail={[{ name: "Capabilities", path: "/capabilities" }]} />
        <h1 className={`${s.title} t-display`} data-lines>
          We don&apos;t sell websites. We sell back <span className="t-serif">your week.</span>
        </h1>
        <p className={`${s.intro} t-lead`} data-fade>
          Three practices under one roof. Most engagements use two of them: a system that removes the work, and an
          interface people actually want to use.
        </p>
      </section>

      {/* Practices */}
      <section className="wrap">
        {practices.map((p) => (
          <article key={p.n} className={`${s.practice} grid`}>
            <div className={`${s.rule} rule`} data-rule />
            <span className={`${s.pn} t-meta muted`}>{p.n}</span>
            <h2 className={`${s.pt} t-h2`} data-lines>
              {p.title}
            </h2>
            <div className={s.pb} data-fade>
              <p className="t-lead">{p.promise}</p>
              <ul className={`${s.items} t-meta`}>
                {p.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      {/* Things you didn't know could be automated */}
      <section className={`${s.auto} section dark`}>
        <div className="wrap">
          <div className={`${s.autoHead} grid`}>
            <Label n="—" className={s.autoLabel}>The index</Label>
            <h2 className={`${s.autoTitle} t-display`} data-lines>
              Twelve things you didn&apos;t know could be automated.
            </h2>
            <p className={`${s.autoCopy} muted`} data-fade>
              Hours are typical per week for a team of five to twenty. Add up the ones that sound familiar.
            </p>
          </div>

          <ol className={s.list}>
            {automatable.map((a, i) => (
              <li key={a.task} className={s.row} data-fade>
                <span className="t-meta muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="t-h3">{a.task}</span>
                <span className={`${s.hrs} t-meta`}>~{a.hours} hrs / wk</span>
              </li>
            ))}
            <li className={`${s.row} ${s.total}`}>
              <span />
              <span className="t-h3">If all twelve apply</span>
              <span className={`${s.hrs} t-meta`}>
                <span data-count>{total}</span> hrs / wk
              </span>
            </li>
          </ol>

          <div className={s.autoFoot} data-fade>
            <p className="t-lead measure">That&apos;s roughly two full-time people. The Diagnostic finds out which of these are yours.</p>
            <Link href="/process" className="t-meta link link--static">
              See how a Diagnostic works <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
      <Motion />
    </>
  );
}
