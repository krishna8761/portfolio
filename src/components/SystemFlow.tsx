import s from "./SystemFlow.module.css";

/**
 * A drawn diagram for back-end systems that have no screen to record.
 * A signal travels down the steps on a loop (pure CSS, paused for reduced motion).
 */
export default function SystemFlow({ title, steps, large = false }: { title: string; steps: string[]; large?: boolean }) {
  const cycle = steps.length * 1.1;
  return (
    <div
      className={`${s.flow} ${large ? s.large : ""} dark`}
      style={{ "--n": steps.length, "--cycle": `${cycle}s` } as React.CSSProperties}
      role="img"
      aria-label={`${title}: ${steps.join(", then ")}`}
    >
      <div className={`${s.head} t-meta`}>
        <span>System</span>
        <span className={s.live}>
          <i aria-hidden /> Running
        </span>
      </div>
      <ol className={s.steps} aria-hidden>
        {steps.map((step, i) => (
          <li key={step} className={s.step} style={{ "--i": i } as React.CSSProperties}>
            <span className={`${s.n} t-meta`}>{String(i + 1).padStart(2, "0")}</span>
            <span className={s.label}>{step}</span>
            <span className={s.tick} />
          </li>
        ))}
      </ol>
      <div className={`${s.foot} t-meta`}>{title}</div>
    </div>
  );
}
