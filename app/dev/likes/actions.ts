"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function insertLike() {
  const supabase = await createSupabaseServerClient();

  // ここでユーザーが取れなければ未ログイン
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }
  if (!user) {
    throw new Error("Not authenticated");
  }

  const productId = `test-${Date.now()}`;

  const { error } = await supabase.from("likes").insert([{ product_id: productId }]);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
