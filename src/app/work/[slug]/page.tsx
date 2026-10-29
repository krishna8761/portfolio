import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Label from "@/components/Label";
import ProjectMedia from "@/components/ProjectMedia";
import SiteVideo from "@/components/SiteVideo";
import { projects } from "@/content/site";
import s from "./case.module.css";
import Motion from "@/components/Motion";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { abs, pageMeta } from "@/lib/seo";

const clip = (t: string, max: number) => (t.length <= max ? t : t.slice(0, t.lastIndexOf(" ", max - 1)).replace(/[,.;:—-]+$/, "") + "…");

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// Every slug is prerendered above, so the page is fully static; opt out of the instant-shell check.
export const instant = false;

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return pageMeta({
    title: `${p.title} — ${p.kind === "System" ? "Custom system" : "Website"} case study`,
    // Keep within ~155 characters so search results show it whole.
    description: clip(`${p.summary} ${p.sector}, ${p.year}.`, 155),
    path: `/work/${p.slug}`,
    image: p.media.kind === "video" ? `/work/thumb/${p.media.slug}-desktop.jpg` : undefined,
  });
}

export default async function CaseStudy(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];

  const facts = [
    ["Type", p.kind === "System" ? "Automation system" : "Website"],
    ["Sector", p.sector],
    ["Scope", p.scope.join(", ")],
    ["Year", String(p.year)],
    ["Status", p.status],
  ];

  return (
    <article>
      {/* Title */}
      <header className={`${s.top} wrap`}>
        <Breadcrumbs
          trail={[
            { name: "Work", path: "/work" },
            { name: p.title, path: `/work/${p.slug}` },
          ]}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: p.title,
            headline: p.summary,
            description: p.problem,
            url: abs(`/work/${p.slug}`),
            dateCreated: String(p.year),
            genre: p.sector,
            keywords: p.scope.join(", "),
            creator: { "@id": `${abs("/")}#organization` },
            ...(p.media.kind === "video" ? { image: abs(`/work/thumb/${p.media.slug}-desktop.jpg`) } : {}),
          }}
        />
        <h1 className={`${s.title} t-mega`} data-lines>
          {p.title}
        </h1>
        <p className={`${s.summary} t-h3`} data-lines data-delay="0.15">
          {p.summary}
        </p>
      </header>

      {/* Cover: desktop recording on wide screens, phone recording on phones */}
      <div className={`${s.cover} media`} data-img data-parallax={p.media.kind === "video" || undefined}>
        {p.media.kind === "video" ? (
          <>
            <div className={s.onDesktop}>
              <ProjectMedia project={p} variant="desktop" />
            </div>
            <div className={s.onMobile}>
              <ProjectMedia project={p} variant="mobile" />
            </div>
          </>
        ) : (
          <ProjectMedia project={p} variant="desktop" large />
        )}
      </div>

      {/* Facts */}
      <div className={`${s.factsRow} wrap`}>
        <dl className={`${s.facts} t-meta`} data-fade="stagger">
          {facts.map(([k, v]) => (
            <div key={k} className={s.fact}>
              <dt className="muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        {p.live && (
          <a href={p.live} target="_blank" rel="noreferrer" className={`${s.liveLink} t-meta link link--static`} data-fade>
            Visit live site <span className="arrow">↗</span>
          </a>
        )}
      </div>

      {/* Problem */}
      <section className={`${s.block} wrap grid`}>
        <Label n="01" className={s.blockLabel}>The problem</Label>
        <p className={`${s.problem} t-h2`} data-lines>
          {p.problem}
        </p>
      </section>

      {/* Interventions */}
      <section className={`${s.block} wrap grid`}>
        <Label n="02" className={s.blockLabel}>{p.kind === "System" ? "How it works" : "What we did"}</Label>
        <ol className={s.steps}>
          {p.interventions.map((it, n) => (
            <li key={it.title} className={s.step} data-fade>
              <span className="t-meta muted">{String(n + 1).padStart(2, "0")}</span>
              <h3 className="t-h3">{it.title}</h3>
              <p className="muted measure">{it.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Desktop + phone, side by side */}
      {p.media.kind === "video" && (
        <section className={`${s.devices} wrap`}>
          <Label n="03">Desktop & mobile</Label>
          <div className={s.deviceRow}>
            <div className={`${s.desk} media`} data-img>
              <SiteVideo slug={p.media.slug} variant="desktop" label={`${p.title} on desktop`} />
            </div>
            <div className={`${s.phone} media`} data-img>
              <SiteVideo slug={p.media.slug} variant="mobile" label={`${p.title} on a phone`} />
            </div>
          </div>
        </section>
      )}

      {/* At a glance */}
      <section className={`${s.outcome} section dark`}>
        <div className="wrap">
          <Label n={p.media.kind === "video" ? "04" : "03"}>At a glance</Label>
          <div className={`${s.numbers} grid`}>
            {p.specs.map((o) => (
              <div key={o.label} className={s.number}>
                <span className="t-mega" data-count>
                  {o.value}
                </span>
                <span className="t-meta muted">{o.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next case */}
      <Link href={`/work/${next.slug}`} className={`${s.next} wrap`}>
        <span className="t-meta muted">Next — {next.kind}</span>
        <div className={s.nextRow}>
          <span className="t-display">{next.title}</span>
          <div className={`${s.nextThumb} media`}>
            <ProjectMedia project={next} variant="mobile" still sizes="240px" />
          </div>
        </div>
      </Link>
      <Motion />
    </article>
  );
}
