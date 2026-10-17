"use client";

import { useRef } from "react";
import { stages } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP, DESKTOP, MOTION_OK } from "@/lib/gsap";
import s from "./process.module.css";

/** On desktop the big stage number stays pinned (CSS sticky) beside its details and ticks over as each stage passes. */
export default function Stages() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
        const digits = gsap.utils.toArray<HTMLElement>(`.${s.digit}`, root.current);
        const rows = gsap.utils.toArray<HTMLElement>(`.${s.stage}`, root.current);
        gsap.set(digits, { yPercent: 100 });
        gsap.set(digits[0], { yPercent: 0 });

        rows.forEach((row, i) => {
          if (i === 0) return;
          ScrollTrigger.create({
            trigger: row,
            start: "top 55%",
            onEnter: () => {
              gsap.to(digits[i - 1], { yPercent: -100, duration: 0.8, ease: "expo.inOut" });
              gsap.fromTo(digits[i], { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: "expo.inOut" });
            },
            onLeaveBack: () => {
              gsap.to(digits[i], { yPercent: 100, duration: 0.8, ease: "expo.inOut" });
              gsap.fromTo(digits[i - 1], { yPercent: -100 }, { yPercent: 0, duration: 0.8, ease: "expo.inOut" });
            },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`${s.stages} wrap grid`}>
      <div className={s.pinCol} aria-hidden>
        <div className={s.pinned}>
          <div className={`${s.digits} t-mega`}>
            {stages.map((st) => (
              <span key={st.n} className={s.digit}>
                {st.n}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ol className={s.list}>
        {stages.map((st) => (
          <li key={st.n} id={`stage-${st.n}`} className={s.stage}>
            <div className="rule" data-rule />
            <div className={s.stageHead}>
              <span className={`${s.mobileN} t-meta muted`}>{st.n}</span>
              <h2 className="t-display" data-lines>
                {st.title}
              </h2>
              <span className="t-meta">{st.duration}</span>
            </div>
            <p className={`${s.happens} t-lead`} data-fade>
              {st.happens}
            </p>
            <dl className={s.detail} data-fade>
              <div>
                <dt className="t-meta muted">You receive</dt>
                <dd>
                  <ul>
                    {st.receive.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="t-meta muted">We need from you</dt>
                <dd>{st.need}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
