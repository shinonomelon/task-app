// app/error/page.jsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const message =
    searchParams.get("message") || "予期せぬエラーが発生しました。";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">エラー</h1>
        <p className="text-red-500">{message}</p>
        <Link href="/" className="mt-4 text-blue-500 underline">
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
