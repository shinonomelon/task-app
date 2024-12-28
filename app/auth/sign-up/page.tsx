"use client";

import { signup } from "@/actions/auth";
import Link from "next/link";
import { useActionState } from "react";

export default function SignUpPage() {
  const [, action, isPending] = useActionState(signup, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            アカウントを作成
          </h2>
        </div>
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">メールアドレス</label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 block w-full border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">パスワード</label>
            <input
              type="password"
              name="password"
              required
              className="mt-1 block w-full border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={isPending}
          >
            {isPending ? "ローディング..." : "サインアップ"}
          </button>
        </form>
        <div className="text-center">
          <Link
            href="/auth/sign-in"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            アカウントをお持ちの方はこちら
          </Link>
        </div>
      </div>
    </div>
  );
}
