"use client";

import { useRef, useState } from "react";
import type { Discipline, Project } from "@/content/site";
import WorkCard from "@/components/WorkCard";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import s from "./work.module.css";

const filters: ("All" | Discipline)[] = ["All", "Platforms", "Automation", "Brand"];
const ratios = ["portrait", "landscape", "landscape", "portrait"] as const;

export default function WorkGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const grid = useRef<HTMLDivElement>(null);
  const shown = active === "All" ? projects : projects.filter((p) => p.disciplines.includes(active));

  const choose = (f: (typeof filters)[number]) => {
    if (f === active) return;
    const el = grid.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setActive(f);
    gsap.to(el, {
      autoAlpha: 0,
      y: 12,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setActive(f);
        requestAnimationFrame(() => {
          gsap.fromTo(el, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "expo.out" });
          ScrollTrigger.refresh();
        });
      },
    });
  };

  return (
    <>
      <div className={`${s.filters} t-meta`} role="group" aria-label="Filter by discipline" data-fade>
        {filters.map((f) => {
          const n = f === "All" ? projects.length : projects.filter((p) => p.disciplines.includes(f)).length;
          return (
            <button key={f} className={`link ${s.filter}`} aria-pressed={active === f} aria-current={active === f ? "page" : undefined} onClick={() => choose(f)}>
              {f} <sup className="muted">{n}</sup>
            </button>
          );
        })}
      </div>

      <div ref={grid} className={`${s.grid} grid`}>
        {shown.map((p, i) => (
          <div key={p.slug} className={s.cell}>
            <WorkCard project={p} ratio={ratios[i % ratios.length]} />
          </div>
        ))}
      </div>
    </>
  );
}
