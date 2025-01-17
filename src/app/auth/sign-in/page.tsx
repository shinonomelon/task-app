'use client';

import Link from 'next/link';
import { useActionState } from 'react';

import { signin } from '@/src/actions/auth';

export default function SignInPage() {
  const [, action, isPending] = useActionState(signin, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            サインイン
          </h2>
        </div>
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">メールアドレス</label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">パスワード</label>
            <input
              type="password"
              name="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            disabled={isPending}
          >
            {isPending ? 'ローディング...' : 'サインイン'}
          </button>
        </form>
        <div className="text-center">
          <Link
            href="/auth/sign-up"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            アカウントをお持ちでない方はこちら
          </Link>
        </div>
      </div>
    </div>
  );
}
