"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Desk() {
  const [user, setUser] = useState(undefined);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
  }, []);

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  async function ensureProfile(uid, email) {
    const { data } = await supabase.from("wick_profiles").select("id").eq("id", uid).maybeSingle();
    if (data) return;
    await supabase.from("wick_profiles").insert({
      id: uid,
      display_name: email?.split("@")[0] || "anonymous",
      handle: (email?.split("@")[0] || "anon").replace(/[^a-z0-9]/gi, "").toLowerCase() + uid.slice(0, 4),
    });
  }

  async function load() {
    const { data, error } = await supabase
      .from("wick_notes")
      .select("*")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false });
    if (error) setErr(error.message);
    else setNotes(data || []);
  }

  async function save(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    await ensureProfile(user.id, user.email);
    const { error } = await supabase.from("wick_notes").insert({
      author_id: user.id,
      title: title.trim() || "Untitled",
      body: body.trim(),
      is_public: isPublic,
    });
    if (error) setErr(error.message);
    else {
      setTitle("");
      setBody("");
      setIsPublic(false);
      setMsg(isPublic ? "Saved and on the wall." : "Saved to your desk.");
      load();
    }
  }

  async function toggle(n) {
    const { error } = await supabase.from("wick_notes").update({ is_public: !n.is_public }).eq("id", n.id);
    if (error) setErr(error.message);
    else load();
  }

  async function remove(n) {
    const { error } = await supabase.from("wick_notes").delete().eq("id", n.id);
    if (error) setErr(error.message);
    else load();
  }

  if (user === undefined) return <p>Loading desk…</p>;
  if (!user)
    return (
      <main>
        <h1>Desk is locked</h1>
        <p className="lede">
          <a href="/login">Sign in</a> to write and keep notes.
        </p>
      </main>
    );

  return (
    <main>
      <section className="hero" style={{ paddingBottom: 8 }}>
        <div>
          <div className="kicker">Private until you say otherwise</div>
          <h1>Desk</h1>
          <p className="lede">Write. Save. Flip public if it belongs on the wall.</p>
        </div>
      </section>
      <form className="panel" onSubmit={save}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        <label>Note</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
        <div className="row">
          <label style={{ margin: 0, textTransform: "none", letterSpacing: 0 }}>
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} /> Public on the wall
          </label>
          <button type="submit">Save note</button>
        </div>
        {err && <p className="err">{err}</p>}
        {msg && <p className="ok">{msg}</p>}
      </form>
      <section className="wall">
        {notes.map((n) => (
          <article className="card" key={n.id}>
            <div className="kicker">{n.is_public ? "Public" : "Desk only"}</div>
            <h3>{n.title}</h3>
            <p>{n.body}</p>
            <footer>
              <button className="ghost" type="button" onClick={() => toggle(n)}>
                {n.is_public ? "Make private" : "Make public"}
              </button>{" "}
              <button className="ghost" type="button" onClick={() => remove(n)}>Delete</button>
            </footer>
          </article>
        ))}
      </section>
    </main>
  );
}
