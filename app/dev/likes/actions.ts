"use server";

import { supabase } from "@/lib/supabase";

export async function insertLike() {
  const { error } = await supabase.from("likes").insert([{ product_id: "test-product" }]);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
