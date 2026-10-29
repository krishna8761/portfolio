import type { Metadata } from "next";
import { projects } from "@/content/site";
import WorkGrid from "./WorkGrid";
import s from "./work.module.css";
import Motion from "@/components/Motion";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = pageMeta({
  title: "Work",
  description:
    "Selected work by Monark Studio: custom systems that capture leads and run follow-ups, plus e-commerce and booking websites built to sell.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <section className={`${s.page} wrap`}>
      <Breadcrumbs trail={[{ name: "Work", path: "/work" }]} />
      <div className={s.head}>
        <h1 className="t-mega" data-lines>
          Work
        </h1>
        <span className={`${s.count} t-meta muted`} data-fade>
          ({String(projects.length).padStart(2, "0")})
        </span>
      </div>
      <p className={`${s.intro} t-lead`} data-fade>
        Every project here started with a problem, not a brief. Each case study shows what was broken, what we built, and
        what changed.
      </p>
      <WorkGrid projects={projects} />
      <Motion />
    </section>
  );
}
