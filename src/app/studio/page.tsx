import type { Metadata } from "next";
import Image from "next/image";
import Label from "@/components/Label";
import Clock from "@/components/Clock";
import { principles, founder, studio } from "@/content/site";
import s from "./studio.module.css";
import Motion from "@/components/Motion";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = pageMeta({
  title: "Studio",
  description:
    "Monark is a small studio of designers and engineers in Bhopal, India, building AI automation, websites and brands for businesses worldwide.",
  path: "/studio",
});

const lab = [
  { src: "/studio/lab-02.jpg", w: 736, h: 1015, alt: "Poster study — chrome mask" },
  { src: "/studio/lab-03.jpg", w: 736, h: 920, alt: "Poster study — Angel & Light" },
  { src: "/studio/lab-04.jpg", w: 735, h: 1040, alt: "Poster study — red visor" },
  { src: "/studio/lab-01.jpg", w: 736, h: 1104, alt: "Poster study — chrome disc" },
];

export default function Studio() {
  return (
    <>
      <section className={`${s.top} wrap`}>
        <Breadcrumbs trail={[{ name: "Studio", path: "/studio" }]} />
        <h1 className={`${s.title} t-display`} data-lines>
          A small studio, on purpose.
        </h1>
        <div className={`${s.intro} grid`}>
          <p className={`${s.lead} t-lead`} data-fade>
            Monark is a studio of designers and engineers based in {studio.city.split(",")[0]}. We stay small so the
            people you meet on the first call are the people who build your system. We work remotely with founders and
            operators wherever they are.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="wrap">
        <Label n="01">How we work</Label>
        <ol className={`${s.principles} grid`}>
          {principles.map((p, i) => (
            <li key={p.title} className={s.principle} data-fade>
              <span className="t-meta muted">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="t-h3">{p.title}</h2>
              <p className="muted">{p.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Founder */}
      <section className={`${s.founder} section wrap grid`}>
        <div className={`${s.portrait} media`} data-img>
          <Image src={founder.image.src} alt={founder.image.alt} fill sizes="(min-width: 900px) 33vw, 100vw" />
        </div>
        <div className={s.bio}>
          <Label n="02">Lead</Label>
          <h2 className={`${s.name} t-h2`} data-lines>
            {founder.name}
          </h2>
          <p className="t-meta muted" data-fade>
            {founder.role}
          </p>
          <p className={`${s.bioText} measure`} data-fade>
            {founder.bio}
          </p>
        </div>
      </section>

      {/* Hours */}
      <section className={`${s.hours} dark section`}>
        <div className="wrap">
          <Label n="03">Working hours</Label>
          <div className={`${s.clocks} grid`}>
            <div className={s.clock}>
              <span className="t-meta muted">Studio — Bhopal (IST)</span>
              <span className="t-mega">
                <Clock timeZone={studio.timezone} />
              </span>
            </div>
            <div className={s.clock}>
              <span className="t-meta muted">Your time</span>
              <span className="t-mega muted">
                <Clock />
              </span>
            </div>
          </div>
          <p className={`${s.hoursNote} t-lead`} data-fade>
            Monday to Friday, 10:00–19:00 IST. Calls with the UK and Europe in the afternoon, the US in the evening. Replies within one working day.
          </p>
        </div>
      </section>

      {/* Lab */}
      <section className={`${s.lab} section wrap`}>
        <div className={s.labHead}>
          <Label n="04">Studio lab</Label>
          <p className="muted measure" data-fade>
            Self-initiated poster and image studies. Not client work — practice that keeps the eye sharp.
          </p>
        </div>
        <div className={s.labGrid}>
          {lab.map((l) => (
            <div key={l.src} className={`${s.labItem} media`} data-img>
              <Image src={l.src} alt={l.alt} fill sizes="(min-width: 900px) 25vw, 50vw" />
            </div>
          ))}
        </div>
      </section>
      <Motion />
    </>
  );
}
