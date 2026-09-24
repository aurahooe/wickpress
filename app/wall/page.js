"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Wall() {
  const [notes, setNotes] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("wick_notes")
        .select("id,title,body,created_at,author_id")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(48);
      if (error) setErr(error.message);
      else setNotes(data || []);
    })();
  }, []);

  return (
    <main>
      <section className="hero" style={{ paddingBottom: 8 }}>
        <div>
          <div className="kicker">Public</div>
          <h1>The wall</h1>
          <p className="lede">Notes marked public by their authors. Nothing else leaves the desk.</p>
        </div>
      </section>
      {err && <p className="err">{err}</p>}
      <section className="wall">
        {notes.map((n, i) => (
          <article className="card" key={n.id} style={{ animationDelay: `${i * 40}ms` }}>
            <div className="kicker">public slip</div>
            <h3>{n.title}</h3>
            <p>{n.body.length > 220 ? n.body.slice(0, 220) + "…" : n.body}</p>
            <footer>{new Date(n.created_at).toLocaleString()}</footer>
          </article>
        ))}
        {!notes.length && !err && <p>The wall is empty. Sign in and pin something.</p>}
      </section>
    </main>
  );
}
