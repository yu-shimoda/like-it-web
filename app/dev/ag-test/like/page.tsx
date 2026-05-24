"use client";

import { useState } from "react";
import Link from "next/link";

export default function LikePage() {
  const [likeCount, setLikeCount] = useState(123);
  const [isLiking, setIsLiking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [delayMs, setDelayMs] = useState<600 | 900 | 1200>(600);

  const handleLike = async () => {
    if (isLiking) return;

    // 楽観的更新: 最初にUIの数値を+1する
    setLikeCount((prev) => prev + 1);
    setIsLiking(true);
    setErrorMsg("");

    try {
      // 疑似通信
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      // 20%の確率で失敗させる
      if (Math.random() < 0.2) {
        throw new Error("Simulation error");
      }
      // 成功のときはそのまま（すでに+1済み）
    } catch (e) {
      // 失敗したらロールバックしてメッセージを表示
      setLikeCount((prev) => prev - 1);
      setErrorMsg("通信に失敗しました。もう一度押してください。");
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto pt-10 px-4">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4">サンプル商品</h2>
        
        <div className="flex items-center gap-2 mb-6 text-pink-500 font-medium text-lg">
          ❤️ <span>{likeCount}</span>
        </div>

        {errorMsg && (
          <p className="text-red-500 text-sm mb-4 font-medium">{errorMsg}</p>
        )}

        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`w-full py-3 mb-6 rounded-lg bg-black text-white font-medium transition-transform duration-100 ease-out active:scale-95 ${
            isLiking ? "opacity-70 cursor-not-allowed active:scale-100" : ""
          }`}
        >
          {isLiking ? "送信中..." : "Like ❤️"}
        </button>

        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-2 font-medium">デバッグ: 通信遅延設定</p>
          <div className="flex gap-2">
            {([600, 900, 1200] as const).map((ms) => (
              <button
                key={ms}
                onClick={() => setDelayMs(ms)}
                className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${
                  delayMs === ms
                    ? "bg-gray-800 text-white font-medium"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {ms}ms
              </button>
            ))}
          </div>
        </div>

        <Link
          href="/dev/ag-test/list"
          className="block w-full text-center border border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          一覧に戻る
        </Link>
      </div>
    </div>
  );
}
