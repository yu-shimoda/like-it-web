"use client";

import { useState } from "react";
import { sendLike } from "./actions";

type Props = {
  productId: string;
  alreadyLiked: boolean;
};

export default function LikeButton({ productId, alreadyLiked }: Props) {
  const [liked, setLiked] = useState(alreadyLiked);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLike = async () => {
    if (liked || loading) return;
    setLoading(true);
    const result = await sendLike(productId);
    setLoading(false);

    if (result.success) {
      setLiked(true);
    } else if (result.error === "already_liked_today") {
      setLiked(true);
      setMessage("今日はすでにLike済みです");
    } else if (result.error === "weekly_limit_exceeded") {
      setMessage("今週のLike上限に達しました");
    } else {
      setMessage("エラーが発生しました");
    }
  };

  return (
    <div>
      <button
        onClick={handleLike}
        disabled={liked || loading}
        style={{
          marginTop: 8,
          padding: "8px 16px",
          background: liked ? "#ccc" : "#000",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: liked ? "default" : "pointer",
        }}
      >
        {loading ? "送信中..." : liked ? "Liked ✓" : "Like"}
      </button>
      {message && <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{message}</p>}
    </div>
  );
}
