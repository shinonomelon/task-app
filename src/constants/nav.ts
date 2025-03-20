import { Calendar, Clock, Inbox } from 'lucide-react';

export const NAV_ITEMS = [
  {
    title: 'インボックス',
    href: '/app/inbox/tasks',
    icon: Inbox
  },
  {
    title: '今日',
    href: '/app/today/tasks',
    icon: Clock
  },
  {
    title: 'カレンダー',
    href: '/app/calendar/tasks',
    icon: Calendar
  }
] as const;
