import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export function hourKey(d = new Date()) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}`;
}

export function msUntilNextHour(d = new Date()) {
  const n = new Date(d);
  n.setUTCMinutes(0, 0, 0);
  n.setUTCHours(n.getUTCHours() + 1);
  return n.getTime() - d.getTime();
}
