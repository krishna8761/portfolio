import { booking } from "@/content/site";

// IST is UTC+5:30 all year, so slot maths needs no timezone library.
const IST_OFFSET_MIN = 330;

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Every bookable slot start (ISO, UTC) from now until `daysAhead`, before removing taken ones. */
export function candidateSlots(now = new Date()): string[] {
  const out: string[] = [];
  const earliest = now.getTime() + booking.minNoticeHours * 3600_000;
  const start = toMin(booking.dayStart);
  const end = toMin(booking.dayEnd) - booking.minutes;

  // "Today" in Bhopal
  const istNow = new Date(now.getTime() + IST_OFFSET_MIN * 60_000);
  for (let d = 0; d <= booking.daysAhead; d++) {
    const day = new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate() + d));
    if (!booking.workdays.includes(day.getUTCDay())) continue;
    for (let m = start; m <= end; m += booking.stepMinutes) {
      const utc = day.getTime() + (m - IST_OFFSET_MIN) * 60_000;
      if (utc >= earliest) out.push(new Date(utc).toISOString());
    }
  }
  return out;
}

export function isCandidate(iso: string, now = new Date()) {
  return candidateSlots(now).includes(iso);
}
