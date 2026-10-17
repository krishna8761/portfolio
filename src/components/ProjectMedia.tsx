import Image from "next/image";
import type { Project } from "@/content/site";
import SiteVideo from "./SiteVideo";
import SystemFlow from "./SystemFlow";
import s from "./ProjectMedia.module.css";

type Props = {
  project: Project;
  variant: "desktop" | "mobile";
  large?: boolean;
  /** Still thumbnail instead of the recording — used in grids, where a wall of moving sites is noise. */
  still?: boolean;
  sizes?: string;
};

/** The visual for a project: its site thumbnail or recording, or a system diagram. */
export default function ProjectMedia({ project, variant, large, still, sizes = "(min-width: 900px) 50vw, 100vw" }: Props) {
  if (project.media.kind === "flow") return <SystemFlow title={project.title} steps={project.media.steps} large={large} />;
  if (still) {
    const src = `/work/thumb/${project.media.slug}-${variant}.jpg`;
    if (variant === "mobile") {
      return (
        <div className={s.stage}>
          <div className={s.phone}>
            <Image src={src} alt={`The ${project.title} website on a phone`} fill sizes="(min-width: 900px) 300px, 54vw" />
          </div>
        </div>
      );
    }
    return (
      <div className={s.desk}>
        <Image src={src} alt={`The ${project.title} website on desktop`} fill sizes={sizes} />
      </div>
    );
  }
  return <SiteVideo slug={project.media.slug} variant={variant} label={`Screen recording of the ${project.title} website`} />;
}
