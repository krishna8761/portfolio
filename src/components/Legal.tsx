import Breadcrumbs from "./Breadcrumbs";
import Motion from "./Motion";
import s from "./Legal.module.css";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

/** Shared layout for policy pages: breadcrumb, title, contents list (desktop) and numbered sections. */
export default function Legal({
  name,
  path,
  title,
  updated,
  intro,
  sections,
}: {
  name: string;
  path: string;
  title: string;
  updated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}) {
  return (
    <article className={`${s.page} wrap`}>
      <Breadcrumbs trail={[{ name, path }]} />
      <h1 className={`${s.title} t-display`} data-lines>
        {title}
      </h1>
      <p className={`${s.updated} t-meta muted`} data-fade>
        Last updated {updated}
      </p>

      <div className={`${s.layout} grid`}>
        <nav className={s.toc} aria-label="Contents">
          <p className="t-meta muted">Contents</p>
          <ol className="t-meta">
            {sections.map((sec, i) => (
              <li key={sec.id}>
                <a href={`#${sec.id}`} className="link">
                  <span className="muted">{String(i + 1).padStart(2, "0")}</span> {sec.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={s.body}>
          <div className={`${s.intro} t-lead`}>{intro}</div>
          {sections.map((sec, i) => (
            <section key={sec.id} id={sec.id} className={s.section}>
              <div className="rule" />
              <h2 className={`${s.h2} t-h3`}>
                <span className="t-meta muted">{String(i + 1).padStart(2, "0")}</span>
                {sec.title}
              </h2>
              <div className={s.text}>{sec.body}</div>
            </section>
          ))}
        </div>
      </div>
      <Motion />
    </article>
  );
}
