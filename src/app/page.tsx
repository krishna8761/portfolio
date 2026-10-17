import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import Label from "@/components/Label";
import WorkCard from "@/components/WorkCard";
import { projects, leaks, stages, engagements } from "@/content/site";
import s from "./home.module.css";
import Motion from "@/components/Motion";
import PhotoStrip, { type StripItem } from "@/components/PhotoStrip";

// Mood images only. They are labelled as mood, never as projects.
const strip: StripItem[] = [
  { src: "/mood/mood-attention.jpg", alt: "Woman in hair rollers reading a newspaper as a match is lit", caption: "Attention", meta: "Mood", ratio: 3 / 4 },
  { src: "/mood/mood-craft.jpg", alt: "A single white tulip against black, with quotation typography", caption: "Craft", meta: "Mood", ratio: 4 / 5 },
  { src: "/mood/mood-strategy.jpg", alt: "Chess king in hard black-and-white light", caption: "Strategy", meta: "Mood", ratio: 9 / 13 },
  { src: "/mood/mood-trust.jpg", alt: "Halftone hand shaking a wireframe hand", caption: "Trust", meta: "Mood", ratio: 4 / 5 },
  { src: "/mood/mood-vision.jpg", alt: "Woman in a steel chair reading a newspaper headlined Think Bigger", caption: "Vision", meta: "Mood", ratio: 1 },
  { src: "/mood/mood-focus.jpg", alt: "Grainy portrait of a man in sunglasses, half in shadow", caption: "Focus", meta: "Mood", ratio: 9 / 14 },
  { src: "/mood/mood-detail.jpg", alt: "White flower with folded silk-like petals on black", caption: "Detail", meta: "Mood", ratio: 4 / 5 },
  { src: "/mood/mood-ambition.jpg", alt: "Woman in money hair rollers holding champagne", caption: "Ambition", meta: "Mood", ratio: 3 / 4 },
];

export const metadata: Metadata = pageMeta({
  description:
    "Monark Studio builds AI automation, websites and brand systems that give businesses their hours back. Fixed USD pricing. Book a free 20-minute call.",
  path: "/",
});

export default function Home() {
  const pick = (slug: string) => projects.find((p) => p.slug === slug)!;
  // Lead with the systems — that's the positioning — then the sites.
  const [a, b, c, d] = ["choukhatt", "ai-receptionist", "design-to-order", "nixiv"].map(pick);
  const diagnostic = engagements[0];

  return (
    <>
      {/* ── Opening statement (after onseis.com) ── */}
      <section className={s.hero}>
        <div className={`${s.heroText} wrap grid`}>
          <span className={s.dot} aria-hidden />
          <h1 className={s.heroLeft} data-fade>
            Everything your{" "}
            <br />
            business runs on
          </h1>
          <p className={s.heroMid} data-fade data-delay="0.1">
            Monark is an independent studio building the systems, websites and brands that give businesses their hours
            back — design, engineering and AI under one roof.
          </p>
          <p className={s.heroRight} data-fade data-delay="0.2">
            Built right.
          </p>
        </div>
        <div className={s.heroCta} data-fade data-delay="0.3">
          <Link href="/contact" className={s.script}>
            <span className={s.ctaDot} aria-hidden />
            book a call
          </Link>
        </div>
        <PhotoStrip items={strip} />
      </section>

      {/* ── Selected work ── */}
      <section className={`${s.work} wrap`}>
        <div className={s.head}>
          <Label n="01">Selected work</Label>
          <Link href="/work" className="t-meta link" data-fade>
            All work ({String(projects.length).padStart(2, "0")}) <span className="arrow">→</span>
          </Link>
        </div>

        <div className={`${s.workGrid} grid`}>
          <div className={s.w1}>
            <WorkCard project={a} ratio="tall" />
          </div>
          <div className={s.w2}>
            <WorkCard project={b} ratio="landscape" />
          </div>
          <div className={s.w3}>
            <WorkCard project={c} ratio="portrait" />
          </div>
          <div className={s.w4}>
            <WorkCard project={d} ratio="landscape" />
          </div>
        </div>
      </section>

      {/* ── Where the hours go ── */}
      <section className={`${s.leaks} section dark`}>
        <div className="wrap">
          <div className={`${s.leaksHead} grid`}>
            <Label n="02" className={s.leaksLabel}>What we fix</Label>
            <h2 className={`${s.leaksTitle} t-h2`} data-lines>
              Every business leaks hours. Most never see where.
            </h2>
            <p className={`${s.leaksCopy} muted`} data-fade>
              These are the five leaks we&apos;re asked to fix most. Figures are typical weekly savings for a team of
              five to twenty — the Diagnostic tells you yours.
            </p>
          </div>

          <ol className={s.leakList}>
            <li className={`${s.leakRow} ${s.leakHead} t-meta muted`} aria-hidden>
              <span />
              <span>The leak</span>
              <span>What we build</span>
              <span>Typical result</span>
            </li>
            {leaks.map((l, i) => (
              <li key={l.problem} className={s.leakRow} data-fade>
                <span className="t-meta muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="t-h3">{l.problem}</span>
                <span className="muted">{l.fix}</span>
                <span className="t-meta">{l.result}</span>
              </li>
            ))}
          </ol>

          <Link href="/capabilities" className={`${s.leaksLink} t-meta link link--static`} data-fade>
            Twelve things you didn&apos;t know could be automated <span className="arrow">→</span>
          </Link>
        </div>
      </section>

      {/* ── Process in brief ── */}
      <section className={`${s.process} section wrap`}>
        <div className={`${s.processHead} grid`}>
          <Label n="03" className={s.processLabel}>How it works</Label>
          <p className={`${s.processCopy} t-lead`} data-fade>
            Every engagement follows the same path. You always know what stage you&apos;re in, what it costs and what
            you get at the end of it.
          </p>
        </div>

        <ol>
          {stages.slice(0, 4).map((st) => (
            <li key={st.n} className={s.stage}>
              <div className="rule" data-rule />
              <Link href="/process" className={s.stageRow}>
                <span className="t-meta muted">{st.n}</span>
                <span className={`${s.stageTitle} t-display`}>{st.title}</span>
                <span className={`${s.stageDur} t-meta`}>{st.duration}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Entry point ── */}
      <section className={`${s.entry} wrap`}>
        <div className="rule" data-rule />
        <div className={`${s.entryGrid} grid`}>
          <Label n="04" className={s.entryLabel}>Where to start</Label>
          <h2 className={`${s.entryTitle} t-h2`} data-lines>
            Start with five days, <span className="t-serif">not five figures.</span>
          </h2>
          <div className={s.entryBody} data-fade>
            <p className="measure">
              The Diagnostic is a fixed {diagnostic.price} look at how your business actually runs. You get a ranked
              list of what to fix and what it&apos;s worth. If we build it together, the fee is credited in full.
            </p>
            <div className={s.entryActions}>
              <Link href="/contact" className="btn">
                Book a diagnostic <span className="arrow">→</span>
              </Link>
              <Link href="/engagements" className="t-meta link link--static">
                All engagements
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Motion />
    </>
  );
}
