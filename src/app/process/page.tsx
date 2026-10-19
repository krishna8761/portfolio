import type { Metadata } from "next";
import { stages } from "@/content/site";
import Stages from "./Stages";
import s from "./process.module.css";
import Motion from "@/components/Motion";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = pageMeta({
  title: "Process",
  description:
    "How a Monark engagement runs: Diagnose, Blueprint, Build, Launch, Run. What happens at each stage, what you receive and how long it takes.",
  path: "/process",
});

export default function Process() {
  return (
    <>
      <section className={`${s.top} wrap`}>
        <Breadcrumbs trail={[{ name: "Process", path: "/process" }]} />
        <h1 className={`${s.title} t-display`} data-lines>
          Five stages. No surprises in <span className="t-serif">any of them.</span>
        </h1>
        <div className={`${s.overview} t-meta`} data-fade="stagger">
          {stages.map((st) => (
            <a key={st.n} href={`#stage-${st.n}`} className={s.ov}>
              <span className="muted">{st.n}</span>
              <span>{st.title}</span>
              <span className="muted">{st.duration}</span>
            </a>
          ))}
        </div>
      </section>

      <Stages />

      <section className={`${s.note} wrap grid`}>
        <p className={`${s.noteText} t-h2`} data-lines>
          You can stop after any stage. Everything you&apos;ve paid for up to that point is yours to keep.
        </p>
      </section>
      <Motion />
    </>
  );
}
