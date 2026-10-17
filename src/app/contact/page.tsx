import type { Metadata } from "next";
import { studio } from "@/content/site";
import Brief from "./Brief";
import s from "./contact.module.css";
import Motion from "@/components/Motion";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = pageMeta({
  title: "Book a call",
  description:
    "Book a free 20-minute discovery call with Monark Studio. Answer four quick questions, then pick a time that suits your timezone.",
  path: "/contact",
});

export default function Contact() {
  return (
    <section className={`${s.page} wrap grid`}>
      <div className={s.side}>
        <Breadcrumbs trail={[{ name: "Book a call", path: "/contact" }]} />
        <h1 className={`${s.title} t-display`} data-lines>
          Tell us what&apos;s <span className="t-serif">slowing you down.</span>
        </h1>
        <div className={`${s.direct} t-meta`} data-fade>
          <p className="muted">
            A free 20-minute call. Four quick questions, then pick a time that suits you — the invite lands in your inbox
            straight away.
          </p>
          <p className="muted">Rather write directly?</p>
          <a href={`mailto:${studio.email}`} className="link link--static">
            {studio.email}
          </a>
        </div>
      </div>
      <div className={s.form}>
        <Brief />
      </div>
      <Motion />
    </section>
  );
}
