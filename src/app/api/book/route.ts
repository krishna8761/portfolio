import { connection } from "next/server";
import { isCandidate } from "@/lib/slots";
import { reserve, release } from "@/lib/store";
import { sendBookingEmails, mailConfigured, type Booking } from "@/lib/mail";

const clean = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Validates a brief, reserves the slot, and emails a calendar invite to both sides. */
export async function POST(req: Request) {
  await connection();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: bots fill every field. Pretend it worked.
  if (clean(body.website)) return Response.json({ ok: true });

  const b: Booking = {
    id: crypto.randomUUID(),
    start: clean(body.slot, 40),
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    phone: clean(body.phone, 40),
    company: clean(body.company, 200),
    pains: Array.isArray(body.pains) ? body.pains.map((p) => clean(p, 120)).filter(Boolean).slice(0, 10) : [],
    budget: clean(body.budget, 60),
    timeline: clean(body.timeline, 60),
    notes: clean(body.notes),
    tz: clean(body.tz, 64) || "Asia/Kolkata",
  };

  try {
    new Intl.DateTimeFormat("en", { timeZone: b.tz });
  } catch {
    b.tz = "Asia/Kolkata";
  }

  if (b.name.length < 2 || !/^\S+@\S+\.\S+$/.test(b.email)) {
    return Response.json({ ok: false, error: "Name and a valid email are required." }, { status: 422 });
  }
  if (!isCandidate(b.start)) {
    return Response.json({ ok: false, error: "That time is no longer available.", code: "slot" }, { status: 409 });
  }

  if (!mailConfigured && process.env.NODE_ENV === "production") {
    return Response.json({ ok: false, error: "Booking email is not configured yet." }, { status: 503 });
  }

  if (!(await reserve(b.start, b))) {
    return Response.json({ ok: false, error: "Someone just booked that time. Please pick another.", code: "slot" }, { status: 409 });
  }

  if (!mailConfigured) {
    console.log("[book] SMTP not configured — booking reserved but not emailed:", JSON.stringify(b, null, 2));
    return Response.json({ ok: true, id: b.id, dev: true });
  }

  try {
    await sendBookingEmails(b);
  } catch (e) {
    console.error("[book] email failed", e);
    await release(b.start); // nobody would know about this booking, so free the slot
    return Response.json({ ok: false, error: "We couldn't send the confirmation." }, { status: 502 });
  }

  return Response.json({ ok: true, id: b.id });
}
