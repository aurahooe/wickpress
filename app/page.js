"use client";

import { useEffect, useState } from "react";
import { hourKey, msUntilNextHour, supabase } from "../lib/supabase";

const HOUSE = [
  { title: "The lamp is still on", body: "This room keeps a single hour at a time. Leave a note if you want. Mark it public and it goes on the wall." },
  { title: "Paper that does not rush", body: "Most sites shout. Wick waits for the clock. If you wrote something last hour, it is still on your desk. If you marked it public, it is already on the wall." },
  { title: "A quiet turn", body: "The press does not ask for a feed. It asks for one slip. Title, body, a choice: keep it or pin it." },
  { title: "Rain on the skylight", body: "Some hours have no public note. Those hours belong to the house. Come back when you have a sentence that can stand alone." },
  { title: "Ink before the bell", body: "Whatever you save is yours. The wall only shows what you marked public. That is the whole contract." },
  { title: "Hold the hour", body: "There is a countdown in the corner. When it dies the edition changes. Nothing else on the page needs to move that fast." },
];

function houseFor(key) {
  let n = 0;
  for (let i = 0; i < key.length; i++) n = (n + key.charCodeAt(i) * (i + 3)) % HOUSE.length;
  return { ...HOUSE[n], kicker: "House dispatch", hour_key: key };
}

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
      setFeat(data || houseFor(key));
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
          <p className="lede">A small press. One edition an hour. Anything you mark public lives on the wall.</p>
        </div>
        <aside className="clock">
          <div className="n">{left || "—"}</div>
          <p>until the next turn · local {now}</p>
        </aside>
      </section>
      <article className="feature">
        <p className="kicker">{feat?.hour_key || ""}</p>
        <div className="body">{feat?.body}</div>
      </article>
    </main>
  );
}
