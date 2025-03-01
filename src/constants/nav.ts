import { Calendar, Clock, Inbox } from 'lucide-react';

export const NAV_ITEMS = [
  {
    title: 'インボックス',
    href: '/app/inbox',
    icon: Inbox
  },
  {
    title: '今日',
    href: '/app/today',
    icon: Clock
  },
  {
    title: 'カレンダー',
    href: '/app/calendar',
    icon: Calendar
  }
] as const;
