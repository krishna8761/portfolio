"use client";

import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};

/** Live clock. Renders a stable placeholder on the server to avoid hydration mismatch. */
export default function Clock({ timeZone, seconds = false }: { timeZone?: string; seconds?: boolean }) {
  // Snapshot only changes when the displayed value would, so the minute clock re-renders once a minute.
  const tick = useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / (seconds ? 1000 : 60000)),
    () => 0,
  );

  if (!tick) return <span>--:--</span>;

  const now = new Date(tick * (seconds ? 1000 : 60000));
  const text = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: seconds ? "2-digit" : undefined,
    hour12: false,
    timeZone,
  }).format(now);

  return <time dateTime={now.toISOString()}>{text}</time>;
}
