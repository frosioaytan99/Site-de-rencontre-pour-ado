import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ChatRoom() {
  const router = useRouter();
  const { id } = router.query;
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    async function load() {
      if (!id) return;
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", id)
        .order("created_at", { ascending: true });
      setMessages(data ?? []);
      // subscribe to new messages
      const sub = supabase
        .channel("public:messages")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${id}` },
          (payload) => {
            setMessages(prev => [...prev, payload.new]);
          }
        )
        .subscribe();
      return () => {
        supabase.removeChannel(sub);
      };
    }
    load();
    return () => { mountedRef.current = false; };
  }, [id]);

  const send = async () => {
    if (!text.trim()) return;
    await supabase.from("messages").insert([{ match_id: id, content_text: text }]);
    setText("");
  };

  return (
    <main style={{ padding: 12 }}>
      <h3>Conversation</h3>
      <div style={{ minHeight: 300, border: "1px solid #ddd", padding: 8 }}>
        {messages.map(m => (
          <div key={m.id} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: "#666" }}>{m.sender_profile ?? "?"} — {new Date(m.created_at).toLocaleString()}</div>
            <div>{m.content_text}</div>
            {m.image_url && (
              <div style={{ marginTop: 6 }}>
                <a href={m.image_url} target="_blank" rel="noreferrer">Voir l'image (lien)</a>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <input value={text} onChange={(e)=>setText(e.target.value)} style={{ width: "70%", padding: 8 }} />
        <button onClick={send} style={{ marginLeft: 8, padding: "8px 12px" }}>Envoyer</button>
      </div>
    </main>
  );
}
