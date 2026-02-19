"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function signUp() {
    setMsg(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMsg(error.message);
      return;
    }
    setMsg(
      "Sign up 成功。続けて Sign in してください（メール確認が必要な設定の場合はメールを確認）",
    );
  }

  async function signIn() {
    setMsg(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMsg(error.message);
      return;
    }
    router.push("/dev/likes");
    router.refresh();
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Login</h1>

      <div style={{ display: "grid", gap: 8, maxWidth: 360 }}>
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          placeholder="password（8文字以上推奨）"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={signUp}>Sign up</button>
        <button onClick={signIn}>Sign in</button>

        {msg && <p style={{ color: "tomato" }}>{msg}</p>}
      </div>
    </main>
  );
}
