import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const s = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(res => setUser(res.data.session?.user ?? null));
    return () => { s.data.subscription?.unsubscribe(); };
  }, []);

  return (
    <main style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>MatchWatch (MVP)</h1>
      <p>Site de rencontre sécurisé — email only, pas de reconnaissance faciale.</p>
      {user ? (
        <>
          <p>Connecté : {user.email}</p>
          <p><Link href="/inbox">Aller à la messagerie</Link></p>
          <p><Link href="/profile">Mon profil</Link></p>
        </>
      ) : (
        <>
          <p><Link href="/register">S'inscrire / se connecter</Link></p>
        </>
      )}
    </main>
  );
}
