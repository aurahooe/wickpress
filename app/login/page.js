"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState("in");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (mode === "up") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: name || email.split("@")[0] } },
      });
      if (error) setErr(error.message);
      else setMsg("Account made. If email confirm is on, check the inbox — otherwise go to the desk.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErr(error.message);
      else setMsg("You are in.");
    }
  }

  async function out() {
    await supabase.auth.signOut();
    setMsg("Signed out.");
  }

  return (
    <main>
      <section className="hero" style={{ paddingBottom: 8 }}>
        <div>
          <div className="kicker">Account</div>
          <h1>{user ? "You are signed in" : mode === "up" ? "Make a desk" : "Come in"}</h1>
          <p className="lede">Email and password. Notes save to your account. Public is a choice you flip yourself.</p>
        </div>
      </section>
      <form className="panel" onSubmit={submit}>
        {user && (
          <>
            <p>{user.email}</p>
            <div className="row">
              <button type="button" className="ghost" onClick={out}>Sign out</button>
              <a className="btn" href="/desk">Open desk</a>
            </div>
          </>
        )}
        {!user && (
          <>
            {mode === "up" && (
              <>
                <label>Display name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </>
            )}
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Password</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="row">
              <button type="submit">{mode === "up" ? "Create account" : "Sign in"}</button>
              <button type="button" className="ghost" onClick={() => setMode(mode === "up" ? "in" : "up")}>
                {mode === "up" ? "I already have a desk" : "I need an account"}
              </button>
            </div>
          </>
        )}
        {err && <p className="err">{err}</p>}
        {msg && <p className="ok">{msg}</p>}
      </form>
    </main>
  );
}
