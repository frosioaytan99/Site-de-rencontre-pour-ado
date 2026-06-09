import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function Register() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSignIn = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // Supabase: signInWithOtp sends a one-time code (email) or magic link depending on config
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      alert(error.message);
    } else {
      alert("Email envoyé. Vérifiez votre boîte pour le code / lien.");
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: 20 }}>
      <h2>Connexion / Inscription</h2>
      <form onSubmit={handleSignIn}>
        <label>
          Email
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: 320, padding: 8, marginTop: 8 }}
          />
        </label>
        <br />
        <button style={{ marginTop: 12, padding: "8px 16px" }} disabled={loading}>
          {loading ? "Envoi..." : "Envoyer lien / code"}
        </button>
      </form>
      <p style={{ marginTop: 12 }}>
        Note : pas d'upload d'images — utilisez des liens externes pour les images.
      </p>
    </main>
  );
}
