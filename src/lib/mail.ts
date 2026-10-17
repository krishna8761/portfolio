import nodemailer from "nodemailer";
import { booking, studio } from "@/content/site";

/**
 * Sends booking confirmations over SMTP.
 *
 * Gmail (quickest): SMTP_HOST=smtp.gmail.com SMTP_PORT=465 SMTP_USER=ks3920933@gmail.com
 * SMTP_PASS=<16-char App Password> MAIL_FROM="Monark Studio <ks3920933@gmail.com>"
 * Any other SMTP provider (Zoho, Google Workspace on monarkstudio.in, Resend SMTP) works the same way.
 */

export type Booking = {
  id: string;
  start: string; // ISO
  name: string;
  email: string;
  phone: string;
  company: string;
  pains: string[];
  budget: string;
  timeline: string;
  notes: string;
  tz: string;
};

export const mailConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const meetUrl = process.env.MEETING_URL; // e.g. a fixed Google Meet or Zoom room

function transporter() {
  const port = Number(process.env.SMTP_PORT ?? 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

// Intl names India's zone "GMT+5:30"; clients expect "IST".
const fmt = (iso: string, timeZone: string) => fmtRaw(iso, timeZone).replace("GMT+5:30", "IST");

const fmtRaw = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
    timeZoneName: "short",
  }).format(new Date(iso));

const icsDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
// RFC 5545: fold lines at 75 octets. 60 characters keeps multi-byte text (×, —) under the limit.
const fold = (line: string) => line.match(/.{1,60}/g)!.join("\r\n ");

function invite(b: Booking) {
  const start = new Date(b.start);
  const end = new Date(start.getTime() + booking.minutes * 60_000);
  const where = meetUrl ?? "Video call — link to follow by email";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Monark Studio//Discovery call//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${b.id}@monarkstudio.in`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${esc(`Monark Studio × ${b.name} — discovery call`)}`,
    `DESCRIPTION:${esc(`${booking.minutes}-minute discovery call.\n\nWhat's slowing things down: ${b.pains.join(", ") || "—"}\n${meetUrl ? `Join: ${meetUrl}` : "A video link will be sent before the call."}`)}`,
    `LOCATION:${esc(where)}`,
    `ORGANIZER;CN=Monark Studio:mailto:${studio.email}`,
    `ATTENDEE;CN=${esc(b.name)};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${b.email}`,
    ...studio.notify.map((e) => `ATTENDEE;CN=Monark Studio;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED:mailto:${e}`),
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Discovery call in 15 minutes",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n");
}

const shell = (body: string) => `<!doctype html><html><body style="margin:0;background:#ede9e1;color:#141413;font-family:Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="font-size:18px;font-weight:600;letter-spacing:-0.03em;padding-bottom:32px;border-bottom:1px solid rgba(20,20,19,.16)">Monark Studio</td></tr>
<tr><td style="padding-top:32px;font-size:16px;line-height:1.55">${body}</td></tr>
<tr><td style="padding-top:40px;font-family:Menlo,monospace;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#5e5b55">Monark Studio · Bhopal, India · ${studio.email}</td></tr>
</table></td></tr></table></body></html>`;

const row = (k: string, v: string) =>
  `<tr><td style="padding:10px 0;border-top:1px solid rgba(20,20,19,.16);font-family:Menlo,monospace;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#5e5b55;width:140px;vertical-align:top">${k}</td><td style="padding:10px 0;border-top:1px solid rgba(20,20,19,.16)">${v}</td></tr>`;

const h = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function sendBookingEmails(b: Booking) {
  const t = transporter();
  const from = process.env.MAIL_FROM ?? `Monark Studio <${process.env.SMTP_USER}>`;
  const ics = invite(b);
  const theirTime = fmt(b.start, b.tz);
  const istTime = fmt(b.start, studio.timezone);
  const first = h(b.name.split(" ")[0]);

  // To the client
  await t.sendMail({
    from,
    to: b.email,
    replyTo: studio.email,
    subject: `Confirmed: your call with Monark Studio — ${theirTime}`,
    text: `Hi ${b.name.split(" ")[0]},\n\nYour ${booking.minutes}-minute call with Monark Studio is booked for ${theirTime}.\n${meetUrl ? `Join here: ${meetUrl}` : "We'll email the video link before the call."}\n\nA calendar invite is attached. If you need to move it, just reply to this email.\n\nKrishna\nMonark Studio`,
    html: shell(`<p style="margin:0 0 20px;font-size:28px;letter-spacing:-0.03em;line-height:1.1">You're booked, ${first}.</p>
<p style="margin:0 0 24px">Your ${booking.minutes}-minute call with Monark Studio is confirmed. We'll spend it on what's slowing you down, and you'll leave with a clear next step either way.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px">${row("When", h(theirTime))}${row("Where", meetUrl ? `<a href="${h(meetUrl)}" style="color:#141413">${h(meetUrl)}</a>` : "Video link to follow by email")}</table>
<p style="margin:24px 0 0">A calendar invite is attached. Need a different time? Just reply to this email.</p>
<p style="margin:24px 0 0">Krishna<br><span style="color:#5e5b55">Monark Studio</span></p>`),
    icalEvent: { method: "REQUEST", filename: "monark-call.ics", content: ics },
  });

  // To the studio
  await t.sendMail({
    from,
    to: studio.notify,
    replyTo: `${b.name} <${b.email}>`,
    subject: `New call booked — ${b.name}${b.company ? ` (${b.company})` : ""} · ${istTime}`,
    text: [
      `When (IST): ${istTime}`,
      `Their time: ${theirTime}`,
      `Name: ${b.name}`,
      `Email: ${b.email}`,
      `Phone / WhatsApp: ${b.phone || "—"}`,
      `Company: ${b.company || "—"}`,
      `Slowing them down: ${b.pains.join(", ") || "—"}`,
      `Budget (USD): ${b.budget || "—"}`,
      `Timeline: ${b.timeline || "—"}`,
      "",
      b.notes || "(no notes)",
    ].join("\n"),
    html: shell(`<p style="margin:0 0 24px;font-size:24px;letter-spacing:-0.03em">New discovery call booked.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px">
${row("IST", h(istTime))}${row("Their time", h(theirTime))}${row("Name", h(b.name))}${row("Email", `<a href="mailto:${h(b.email)}" style="color:#141413">${h(b.email)}</a>`)}${row("Phone", h(b.phone || "—"))}${row("Company", h(b.company || "—"))}${row("Pain points", h(b.pains.join(", ") || "—"))}${row("Budget", h(b.budget || "—"))}${row("Timeline", h(b.timeline || "—"))}${row("Notes", h(b.notes || "—").replace(/\n/g, "<br>"))}
</table>`),
    icalEvent: { method: "REQUEST", filename: "monark-call.ics", content: ics },
  });
}
