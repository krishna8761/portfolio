"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { booking, brief, studio } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/components/SmoothScroll";
import s from "./contact.module.css";

type Data = {
  pains: string[];
  budget: string;
  timeline: string;
  slot: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  website: string; // honeypot
};

const empty: Data = { pains: [], budget: "", timeline: "", slot: "", name: "", email: "", phone: "", company: "", notes: "", website: "" };
const steps = [
  "What's slowing you down?",
  "What budget are you working with?",
  "When do you need it?",
  `Pick a time for a ${booking.minutes}-minute call.`,
  "Who should we expect?",
];

const localTz = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
const dayKey = (iso: string, tz: string) => new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date(iso));
const time = (iso: string, tz: string) => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(new Date(iso));
const longWhen = (iso: string, tz: string) =>
  new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(new Date(iso));

export default function Brief() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(empty);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [slots, setSlots] = useState<string[] | null>(null);
  const [day, setDay] = useState("");
  const [tz] = useState(localTz);
  const panel = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => setData((d) => ({ ...d, [k]: v }));

  const loadSlots = () =>
    fetch("/api/slots", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: { slots: string[] }) => setSlots(j.slots))
      .catch(() => setSlots([]));

  // Fetch availability in the background so the time step opens instantly.
  useEffect(() => {
    loadSlots();
  }, []);

  // Group by the visitor's own calendar day — an IST afternoon can be someone else's morning.
  const days = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const iso of slots ?? []) {
      const k = dayKey(iso, tz);
      map.set(k, [...(map.get(k) ?? []), iso]);
    }
    return [...map.entries()];
  }, [slots, tz]);
  const activeDay = day && days.some(([k]) => k === day) ? day : days[0]?.[0] ?? "";
  const daySlots = days.find(([k]) => k === activeDay)?.[1] ?? [];

  const valid = [
    data.pains.length > 0,
    !!data.budget,
    !!data.timeline,
    !!data.slot,
    data.name.trim().length > 1 && /^\S+@\S+\.\S+$/.test(data.email),
  ][step];

  const go = (to: number) => {
    const el = panel.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setStep(to);
    const dir = to > step ? 1 : -1;
    gsap.to(el, {
      autoAlpha: 0,
      x: -24 * dir,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        setStep(to);
        gsap.fromTo(el, { autoAlpha: 0, x: 24 * dir }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "expo.out" });
      },
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < steps.length - 1) return valid && go(step + 1);
    if (!valid) return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, tz }),
      });
      const j = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
      if (res.ok) {
        setStatus("sent");
        const l = getLenis();
        if (l) l.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setStatus("error");
      setError(j.error ?? "Something went wrong.");
      if (j.code === "slot") {
        // The time was taken meanwhile: refresh availability and send them back to pick again.
        set("slot", "");
        loadSlots();
        go(3);
      }
    } catch {
      setStatus("error");
      setError("Something went wrong.");
    }
  };

  if (status === "sent") {
    return (
      <div className={s.done}>
        <p className="t-meta muted">Booked</p>
        <p className="t-h2">See you {longWhen(data.slot, tz)}.</p>
        <p className="t-lead muted measure">
          A confirmation and calendar invite are on their way to {data.email}. Need a different time? Reply to that email.
        </p>
        <dl className={`${s.summary} t-meta`}>
          <div>
            <dt className="muted">Your time</dt>
            <dd>{longWhen(data.slot, tz)}</dd>
          </div>
          <div>
            <dt className="muted">Bhopal (IST)</dt>
            <dd>{longWhen(data.slot, studio.timezone)}</dd>
          </div>
          <div>
            <dt className="muted">Length</dt>
            <dd>{booking.minutes} minutes</dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={s.brief} noValidate>
      <div className={`${s.progress} t-meta`}>
        <span>
          {String(step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
        </span>
        <span className={s.bar} aria-hidden>
          <span style={{ transform: `scaleX(${(step + 1) / steps.length})` }} />
        </span>
      </div>

      <div ref={panel} className={s.panel}>
        <fieldset>
          <legend className={`${s.q} t-h2`}>{steps[step]}</legend>

          {step === 0 && (
            <div className={s.options}>
              <p className="t-meta muted">Choose any that apply</p>
              {brief.pains.map((p) => {
                const on = data.pains.includes(p);
                return (
                  <label key={p} className={s.option} data-on={on}>
                    <input type="checkbox" checked={on} onChange={() => set("pains", on ? data.pains.filter((x) => x !== p) : [...data.pains, p])} />
                    <span className="t-h3">{p}</span>
                    <span className={s.tick} aria-hidden />
                  </label>
                );
              })}
            </div>
          )}

          {(step === 1 || step === 2) && (
            <div className={s.options}>
              {(step === 1 ? brief.budgets : brief.timelines).map((o) => {
                const key = step === 1 ? "budget" : "timeline";
                const on = data[key] === o;
                return (
                  <label key={o} className={s.option} data-on={on}>
                    <input type="radio" name={key} checked={on} onChange={() => set(key, o)} />
                    <span className="t-h3">{o}</span>
                    <span className={s.tick} aria-hidden />
                  </label>
                );
              })}
              {step === 1 && <p className="t-meta muted">All figures in USD. A rough range is fine.</p>}
            </div>
          )}

          {step === 3 && (
            <div className={s.picker}>
              <p className="t-meta muted">
                Times shown in your timezone · {tz.replace(/_/g, " ")}
              </p>
              {slots === null && <p className="t-meta">Loading availability…</p>}
              {slots && !days.length && (
                <p className="t-lead">
                  No open times right now. Email <a href={`mailto:${studio.email}`} className="link link--static">{studio.email}</a> and
                  we&apos;ll find one.
                </p>
              )}
              {!!days.length && (
                <>
                  <div className={s.days} role="radiogroup" aria-label="Day">
                    {days.map(([k, list]) => {
                      const d = new Date(list[0]);
                      return (
                        <button
                          type="button"
                          key={k}
                          role="radio"
                          aria-checked={k === activeDay}
                          className={s.day}
                          onClick={() => setDay(k)}
                        >
                          <span className="t-meta muted">{new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: tz }).format(d)}</span>
                          <span className="t-h3">{new Intl.DateTimeFormat("en-GB", { day: "numeric", timeZone: tz }).format(d)}</span>
                          <span className="t-meta muted">{new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: tz }).format(d)}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className={s.times} role="radiogroup" aria-label="Time">
                    {daySlots.map((iso) => (
                      <label key={iso} className={s.time} data-on={data.slot === iso}>
                        <input type="radio" name="slot" checked={data.slot === iso} onChange={() => set("slot", iso)} />
                        <span className="t-h3">{time(iso, tz)}</span>
                        {time(iso, tz) !== time(iso, studio.timezone) && <span className="t-meta muted">{time(iso, studio.timezone)} IST</span>}
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {step === 4 && (
            <div className={s.fields}>
              <p className={`${s.when} t-meta`}>
                {longWhen(data.slot, tz)} · {booking.minutes} min ·{" "}
                <button type="button" className="link link--static" onClick={() => go(3)}>
                  Change
                </button>
              </p>
              <label className={s.field}>
                <span className="t-meta muted">Name</span>
                <input autoComplete="name" value={data.name} onChange={(e) => set("name", e.target.value)} required />
              </label>
              <label className={s.field}>
                <span className="t-meta muted">Work email</span>
                <input type="email" inputMode="email" autoComplete="email" value={data.email} onChange={(e) => set("email", e.target.value)} required />
              </label>
              <label className={s.field}>
                <span className="t-meta muted">Phone / WhatsApp (optional)</span>
                <input type="tel" inputMode="tel" autoComplete="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} />
              </label>
              <label className={s.field}>
                <span className="t-meta muted">Company (optional)</span>
                <input autoComplete="organization" value={data.company} onChange={(e) => set("company", e.target.value)} />
              </label>
              <label className={s.field}>
                <span className="t-meta muted">Anything we should know before the call? (optional)</span>
                <textarea rows={3} value={data.notes} onChange={(e) => set("notes", e.target.value)} />
              </label>
              <label className={s.hp} aria-hidden>
                Website
                <input tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set("website", e.target.value)} />
              </label>
            </div>
          )}
        </fieldset>
      </div>

      <div className={s.nav}>
        {step > 0 ? (
          <button type="button" className="t-meta link" onClick={() => go(step - 1)}>
            ← Back
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className="btn" disabled={!valid || status === "sending"}>
          {step < steps.length - 1 ? "Continue" : status === "sending" ? "Booking…" : "Book the call"} <span className="arrow">→</span>
        </button>
      </div>

      {status === "error" && (
        <p className={`${s.error} t-meta`} role="alert">
          {error} If it keeps happening, email <a href={`mailto:${studio.email}`}>{studio.email}</a>.
        </p>
      )}
    </form>
  );
}
