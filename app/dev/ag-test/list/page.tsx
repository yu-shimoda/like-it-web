import Link from "next/link";

export default function Page() {
  return (
    <div className="max-w-sm mx-auto pt-10 px-4">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-2">サンプル商品</h2>
        <p className="text-gray-600 text-sm mb-4">これは一覧モックです</p>
        
        <div className="flex items-center gap-2 mb-6 text-pink-500 font-medium">
          ❤️ <span>123</span>
        </div>

        <Link 
          href="/dev/ag-test/like" 
          className="block w-full text-center bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          いいね画面へ
        </Link>
      </div>
    </div>
  );
}

