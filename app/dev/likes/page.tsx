import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LikeButton from "./LikeButton";

export default async function LikesPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 商品一覧をカテゴリ情報と一緒に取得
  const { data: products } = await supabase
    .from("products")
    .select("id, name, brand, categories(name)")
    .eq("is_active", true);

  // 今日すでにLikeした商品IDの一覧（JST基準）
  const jstDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const today = jstDate.toISOString().split("T")[0];

  const { data: todayLikes } = await supabase
    .from("likes")
    .select("product_id")
    .eq("liked_date", today);

  const likedTodayIds = new Set((todayLikes ?? []).map((l) => l.product_id));

  // 商品ごとの自分の累積Like数
  const { data: allLikes } = await supabase.from("likes").select("product_id");

  const countMap: Record<string, number> = {};
  (allLikes ?? []).forEach((l) => {
    countMap[l.product_id] = (countMap[l.product_id] ?? 0) + 1;
  });

  return (
    <main style={{ padding: 16 }}>
      <h1>Like it</h1>
      <p style={{ color: "#888", fontSize: 14 }}>ログイン中: {user.email}</p>

      <ul style={{ listStyle: "none", padding: 0, marginTop: 24 }}>
        {(products ?? []).map((product) => (
          <li
            key={product.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #eee",
              borderRadius: 8,
            }}
          >
            <div style={{ fontWeight: "bold" }}>{product.name}</div>
            <div style={{ fontSize: 13, color: "#888" }}>{product.brand}</div>
            <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>
              累積Like: {countMap[product.id] ?? 0}回
            </div>
            <LikeButton productId={product.id} alreadyLiked={likedTodayIds.has(product.id)} />
          </li>
        ))}
      </ul>
    </main>
  );
}
