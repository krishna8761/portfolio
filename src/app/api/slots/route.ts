import { connection } from "next/server";
import { candidateSlots } from "@/lib/slots";
import { takenAmong } from "@/lib/store";

/** Open discovery-call slots (ISO, UTC) for the next two weeks. */
export async function GET() {
  await connection(); // depends on the current time and live bookings; never prerender
  const all = candidateSlots();
  const taken = await takenAmong(all);
  return Response.json(
    { slots: all.filter((s) => !taken.has(s)) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
