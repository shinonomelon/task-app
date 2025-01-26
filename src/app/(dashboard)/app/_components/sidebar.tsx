'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { UserMenu } from './user-memu';

import { cn } from '@/lib/utils';

import { NAV_ITEMS } from '@/constants/nav';

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'fixed flex h-screen flex-col gap-4 border-r md:p-6 pt-6 bg-background md:w-64 w-16'
      )}
    >
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              'flex items-center gap-2 p-2 rounded-md hover:bg-muted/80',
              pathname == item.href && 'bg-muted font-semibold'
            )}
          >
            <item.icon className="mx-auto size-6 md:mx-0" />
            <span className="hidden md:block">{item.title}</span>
          </Link>
        ))}
      </nav>
      <div className="h-px w-full shrink-0 bg-border" />
      <UserMenu />
    </div>
  );
};
