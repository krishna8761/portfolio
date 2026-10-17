/**
 * Slot reservations.
 *
 * Production: Upstash Redis over its REST API (set UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN). `SET NX` makes each reservation atomic, so two
 * visitors can never book the same slot.
 *
 * Without those variables it falls back to process memory. That is fine for local
 * development, but on serverless hosts memory isn't shared between instances.
 */

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
const key = (iso: string) => `monark:slot:${iso}`;
const TTL = 60 * 60 * 24 * 30; // keep a booking record for 30 days

type Mem = Map<string, string>;
const g = globalThis as unknown as { __monarkSlots?: Mem };
const mem: Mem = (g.__monarkSlots ??= new Map());

async function redis<T>(command: (string | number)[]): Promise<T> {
  const res = await fetch(url!, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis ${res.status}`);
  const { result } = (await res.json()) as { result: T };
  return result;
}

export const persistent = Boolean(url && token);

export async function takenAmong(slots: string[]): Promise<Set<string>> {
  if (!slots.length) return new Set();
  if (!persistent) return new Set(slots.filter((s) => mem.has(key(s))));
  const values = await redis<(string | null)[]>(["MGET", ...slots.map(key)]);
  return new Set(slots.filter((_, i) => values[i] !== null));
}

/** Returns false if somebody already holds the slot. */
export async function reserve(slot: string, record: object): Promise<boolean> {
  const value = JSON.stringify(record);
  if (!persistent) {
    if (mem.has(key(slot))) return false;
    mem.set(key(slot), value);
    return true;
  }
  const ok = await redis<string | null>(["SET", key(slot), value, "NX", "EX", TTL]);
  return ok === "OK";
}

export async function release(slot: string) {
  if (!persistent) return void mem.delete(key(slot));
  await redis(["DEL", key(slot)]);
}
