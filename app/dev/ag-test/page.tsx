"use client";

import { useMemo, useState } from "react";

type LikeState = "idle" | "loading" | "error";

export default function AGTestPage() {
  const [count, setCount] = useState(123);
  const [state, setState] = useState<LikeState>("idle");

  const isDisabled = state === "loading";
  const label = useMemo(() => {
    if (state === "loading") return "送信中…";
    if (state === "error") return "失敗：再試行";
    return `Like ❤️ ${count}`;
  }, [state, count]);

  async function onLike() {
    if (state === "loading") return;

    // 触感のため、先に楽観更新（気持ちよさ重視）
    setCount((c) => c + 1);
    setState("loading");

    // 疑似通信（遅延の体感を作る）
    await new Promise((r) => setTimeout(r, 1200));

    // 疑似失敗（20%で失敗）
    const fail = Math.random() < 0.2;
    if (fail) {
      // 失敗時は戻す（仕様として決める）
      setCount((c) => c - 1);
      setState("error");
      return;
    }

    setState("idle");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 space-y-4">
        <div className="h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
          商品画像（なしでも崩れない）
        </div>

        <h1 className="text-lg font-semibold break-words">
          これはとても長い商品名のサンプルテキストですテストテストテストテスト
        </h1>

        <button
          onClick={onLike}
          disabled={isDisabled}
          className={`w-full py-3 rounded-lg text-white transition-transform duration-75 active:scale-95 ${
            isDisabled ? "bg-gray-700 opacity-70" : "bg-black"
          }`}
        >
          {label}
        </button>

        {state === "error" && (
          <p className="text-sm text-red-600">通信に失敗しました。もう一度押してください。</p>
        )}

        <p className="text-xs text-gray-500">※20%で失敗します（触感と仕様決め用）</p>
      </div>
    </main>
  );
}
