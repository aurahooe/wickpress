"use client";

import { useEffect, useState } from "react";
import { hourKey, msUntilNextHour, supabase } from "../lib/supabase";

const FALLBACK = {
  kicker: "House dispatch",
  title: "The press is warming",
  body: "If no public note is ready for this hour, Wick prints a quiet dispatch of its own. Come back when the clock turns. Leave something if you like.",
};

export default function Home() {
  const [feat, setFeat] = useState(null);
  const [left, setLeft] = useState("");
  const [now, setNow] = useState("");

  useEffect(() => {
    let alive = true;
    async function load() {
      const key = hourKey();
      const { data } = await supabase.from("wick_hours").select("*").eq("hour_key", key).maybeSingle();
      if (!alive) return;
      setFeat(data || { ...FALLBACK, hour_key: key });
    }
    load();
    const id = setInterval(() => {
      const ms = msUntilNextHour();
      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setLeft(`${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
      setNow(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      if (ms < 1200) load();
    }, 250);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <main>
      <section className="hero">
        <div>
          <div className="kicker">{feat?.kicker || "This hour"}</div>
          <h1>{feat?.title || "Wick"}</h1>
          <p className="lede">
            A small press. One edition an hour. Anything you mark public lives on the wall.
          </p>
        </div>
        <aside className="clock">
          <div className="n">{left || "—"}</div>
          <p>until the next turn · local {now}</p>
        </aside>
      </section>
      <article className="feature">
        <p className="kicker">{feat?.hour_key || ""}</p>
        <div className="body">{feat?.body || FALLBACK.body}</div>
      </article>
    </main>
  );
}
