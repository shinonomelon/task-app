'use client';

import Link from 'next/link';

import { useUser } from '@/lib/auth';

import { Button } from '@/components/ui/button';

export const Header = () => {
  const { user } = useUser();
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">Task App</span>
        </Link>
        {user ? (
          <Button>
            <Link href="/app">ダッシュボードへ移動</Link>
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button variant="ghost" className="rounded-xl font-bold" asChild>
              <Link
                href={{
                  pathname: '/auth',
                  query: { type: 'signin' }
                }}
              >
                ログイン
              </Link>
            </Button>
            <Button
              variant="default"
              className="rounded-xl bg-zinc-800 font-bold"
              asChild
            >
              <Link
                href={{
                  pathname: '/auth',
                  query: { type: 'signup' }
                }}
              >
                新規登録
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
