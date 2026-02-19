import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LikesPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main style={{ padding: 16 }}>
        <h1>/likes</h1>
        <p>ログインが必要です。</p>
        <Link href="/login">/login へ</Link>
      </main>
    );
  }

  const { data, error } = await supabase
    .from("likes")
    .select("id, product_id, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main style={{ padding: 16 }}>
        <h1>/likes</h1>
        <p>取得に失敗しました: {error.message}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 16 }}>
      <h1>/likes</h1>
      <p>ログイン中: {user.email ?? user.id}</p>

      <ul>
        {(data ?? []).map((row) => (
          <li key={row.id}>
            <div>product_id: {row.product_id}</div>
            <div>created_at: {row.created_at}</div>
          </li>
        ))}
      </ul>

      <hr />
      <Link href="/dev/likes">/dev/likes に戻る</Link>
    </main>
  );
}
