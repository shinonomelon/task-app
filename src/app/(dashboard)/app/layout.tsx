'use client';

import { Inbox } from 'lucide-react';
import Link from 'next/link';

import { useUser } from '@/lib/auth';

import { Button } from '@/components/ui/button';

export function Sidebar() {
  const { user } = useUser();

  return (
    <div className="fixed flex h-screen w-72 flex-col gap-4 border-r p-4">
      {user ? (
        <span>{user.email}</span>
      ) : (
        <Button
          asChild
          className="rounded-full bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
        >
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      )}
      <nav className="space-y-1">
        <Link
          href="/app"
          className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1.5"
        >
          <Inbox className="size-4" />
          インボックス
        </Link>
      </nav>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {children}
    </div>
  );
}
