import { Clock, Inbox, LayoutDashboard } from 'lucide-react';

export const NAV_ITEMS = [
  {
    title: 'ダッシュボード',
    href: '/app',
    icon: LayoutDashboard
  },
  {
    title: 'インボックス',
    href: '/app/inbox',
    icon: Inbox
  },
  {
    title: '今日',
    href: '/app/today',
    icon: Clock
  }
] as const;
