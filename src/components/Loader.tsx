import s from "./Loader.module.css";

// One lead, followed through the system to the result. Each word lines up with a tick on the track.
const steps = ["Lead", "Replied", "Followed up", "Booked", "Paid."];

/**
 * First-load intro. Pure CSS, so it plays before hydration and exits on its own even if JS fails.
 * Skipped for reduced motion and in-site arrivals (html.no-intro, set in <head>).
 */
export default function Loader() {
  return (
    <div className={s.loader} aria-hidden>
      <div className={s.inner}>
        <div className={`${s.top} t-meta`}>
          <span>Monark Studio</span>
          <span className={s.stage}>
            <span className={s.mask}>
              <span className={s.stack}>
                {steps.map((_, i) => (
                  <span key={i}>{String(i + 1).padStart(2, "0")}</span>
                ))}
              </span>
            </span>
            <span className="muted">&nbsp;/ 05</span>
          </span>
        </div>

        <div className={s.word}>
          <span className={s.mask}>
            <span className={s.stack}>
              {steps.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </span>
          </span>
        </div>

        <div className={s.bottom}>
          <div className={s.track}>
            <span className={s.fill} />
            {steps.map((w, i) => (
              <span key={w} className={s.tick} style={{ left: i === 4 ? "calc(100% - 1px)" : `${i * 25}%`, animationDelay: `${0.1 + i * 0.41}s` }} />
            ))}
            <span className={s.run}>
              <span className={s.dot} />
            </span>
          </div>
          <div className={`${s.ends} t-meta muted`}>
            <span>Lead in</span>
            <span>Revenue out</span>
          </div>
        </div>
      </div>
    </div>
  );
}
