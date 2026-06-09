import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

export default function Inbox() {
  const [threads, setThreads] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;
      const user = session.session.user;
      // load profile by user id (profiles.user_id links to auth.users.id)
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (mounted) {
        setProfile(data);
        // get matches where this profile is involved
        const { data: m } = await supabase
          .from("matches")
          .select("id, user_a, user_b, created_at")
          .or(`user_a.eq.${data.id},user_b.eq.${data.id}`);
        setThreads(m ?? []);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h2>Boîte de réception</h2>
      {!profile && <p>Chargement de profil... (assurez-vous d'avoir complété votre profil)</p>}
      <ul>
        {threads.map(t => {
          const otherId = t.user_a === profile?.id ? t.user_b : t.user_a;
          return (
            <li key={t.id}>
              <Link href={`/chat/${t.id}`}>Conversation {t.id.slice(0, 8)} — participant {otherId?.slice?.(0,8)}</Link>
            </li>
          );
        })}
      </ul>
      <p style={{ marginTop: 16 }}><Link href="/">Retour</Link></p>
    </main>
  );
}
