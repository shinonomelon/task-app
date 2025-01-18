import Link from 'next/link';

import { Button } from '@/components/ui/button';

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">Task App</span>
        </Link>
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
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f2f9f2]">
      <Header />
      {children}
    </main>
  );
}
