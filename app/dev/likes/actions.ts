"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendLike(productId: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "unauthorized" };

  const jstDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const likedDate = jstDate.toISOString().split("T")[0];

  const dayOfWeek = jstDate.getDay();
  const monday = new Date(jstDate);
  monday.setDate(jstDate.getDate() - ((dayOfWeek + 6) % 7));
  const mondayStr = monday.toISOString().split("T")[0];

  const { count } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("liked_date", mondayStr);

  if ((count ?? 0) >= 70) {
    return { error: "weekly_limit_exceeded" };
  }

  const { error } = await supabase.from("likes").insert({
    user_id: user.id,
    product_id: productId,
    liked_date: likedDate,
  });

  if (error?.code === "23505") return { error: "already_liked_today" };
  if (error) return { error: "unknown" };

  revalidatePath("/dev/likes");
  return { success: true };
}
