'use client';

import { Clock, Inbox } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

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
      {user && <span>{user.email}</span>}
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              'flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/80',
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
