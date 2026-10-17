import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/site";
import ProjectMedia from "./ProjectMedia";
import s from "./WorkCard.module.css";

type Props = {
  project: Project;
  ratio?: "portrait" | "landscape" | "tall";
};

export default function WorkCard({ project, ratio = "portrait" }: Props) {
  // Portrait frames show the phone thumbnail, landscape frames the desktop one.
  const variant = ratio === "landscape" ? "desktop" : "mobile";
  return (
    <Link href={`/work/${project.slug}`} className={s.card}>
      <div
        className={`${s.frame} ${s[ratio]} media`}
        data-kind={project.media.kind}
        data-img
      >
        {project.cardImage ? (
          <Image
            src={project.cardImage.src}
            alt={project.cardImage.alt}
            fill
            sizes="(min-width: 900px) 50vw, 100vw"
            style={{ objectPosition: project.cardImage.focus }}
          />
        ) : (
          <ProjectMedia project={project} variant={variant} still />
        )}
      </div>
      <dl className={`${s.caption} t-meta`}>
        <div className={s.line}>
          <dt className="sr-only">Project</dt>
          <dd className={s.title}>
            {project.title} <span aria-hidden>•</span> {project.year}
          </dd>
          <dd className={`${s.go} arrow`} aria-hidden>
            →
          </dd>
        </div>
        <div className={s.line}>
          <dt className="sr-only">Sector</dt>
          <dd className="muted">{project.sector}</dd>
        </div>
        <div className={s.line}>
          <dt className="sr-only">Status</dt>
          <dd className="muted">{project.status}</dd>
          <dd className={`${s.kind} muted`}>{project.kind}</dd>
        </div>
      </dl>
    </Link>
  );
}
