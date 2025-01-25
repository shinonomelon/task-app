'use client';

import { Clock, Inbox } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  {
    title: 'インボックス',
    href: '/app',
    icon: Inbox
  },
  {
    title: '今日',
    href: '/app/today',
    icon: Clock
  }
];

export const Sidebar = () => {
  const pathname = usePathname();
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
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              'flex items-center gap-2 rounded-md px-2 py-1.5',
              pathname == item.href && 'bg-muted'
            )}
          >
            <item.icon className="size-4" />
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
};
