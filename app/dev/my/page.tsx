import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MyPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 自分の全Likeを取得
  const { data: allLikes } = await supabase
    .from("likes")
    .select("product_id, liked_date")
    .order("liked_date", { ascending: false });

  // 商品ごとのLike数を集計
  const countMap: Record<string, number> = {};
  const lastLikedMap: Record<string, string> = {};
  (allLikes ?? []).forEach((l) => {
    countMap[l.product_id] = (countMap[l.product_id] ?? 0) + 1;
    if (!lastLikedMap[l.product_id]) {
      lastLikedMap[l.product_id] = l.liked_date;
    }
  });

  // Likeしたことがある商品IDの一覧（Like数順）
  const likedProductIds = Object.keys(countMap).sort((a, b) => countMap[b] - countMap[a]);

  // 商品情報を取得
  const { data: products } = await supabase
    .from("products")
    .select("id, name, brand, categories(name)")
    .in("id", likedProductIds.length > 0 ? likedProductIds : ["none"]);

  // 商品IDで引けるようにMap化
  const productMap = Object.fromEntries((products ?? []).map((p) => [p.id, p]));

  // 今週のLike数を計算
  const jstDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const dayOfWeek = jstDate.getDay();
  const monday = new Date(jstDate);
  monday.setDate(jstDate.getDate() - ((dayOfWeek + 6) % 7));
  const mondayStr = monday.toISOString().split("T")[0];

  const weeklyCount = (allLikes ?? []).filter((l) => l.liked_date >= mondayStr).length;

  return (
    <main style={{ padding: 16 }}>
      <h1>マイページ</h1>
      <p style={{ color: "#888", fontSize: 14 }}>{user.email}</p>

      {/* 今週のLike数 */}
      <div
        style={{
          marginTop: 16,
          marginBottom: 24,
          padding: 12,
          background: "#111",
          borderRadius: 8,
          fontSize: 14,
          color: "#aaa",
        }}
      >
        今週のLike：{weeklyCount} / 70
      </div>

      {/* Likeした商品がない場合 */}
      {likedProductIds.length === 0 && (
        <p style={{ color: "#666" }}>
          まだLikeした商品がありません。
          <Link href="/dev/likes" style={{ color: "#fff", marginLeft: 8 }}>
            商品一覧へ
          </Link>
        </p>
      )}

      {/* Likeした商品一覧（Like数順） */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {likedProductIds.map((productId, index) => {
          const product = productMap[productId];
          if (!product) return null;

          return (
            <li
              key={productId}
              style={{
                marginBottom: 12,
                padding: 16,
                border: "1px solid #333",
                borderRadius: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>#{index + 1}</div>
                <div style={{ fontWeight: "bold" }}>{product.name}</div>
                <div style={{ fontSize: 13, color: "#888" }}>{product.brand}</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
                  最終Like：{lastLikedMap[productId]}
                </div>
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: "#fff",
                  minWidth: 60,
                  textAlign: "right",
                }}
              >
                {countMap[productId]}
                <span style={{ fontSize: 12, color: "#666", marginLeft: 2 }}>回</span>
              </div>
            </li>
          );
        })}
      </ul>

      <div style={{ marginTop: 24 }}>
        <Link href="/dev/likes" style={{ color: "#888", fontSize: 14 }}>
          ← 商品一覧に戻る
        </Link>
      </div>
    </main>
  );
}
