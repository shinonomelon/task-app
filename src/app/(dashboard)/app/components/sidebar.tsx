import { Inbox, Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/src/components/ui/button';

export function Sidebar() {
  return (
    <div className="fixed flex h-screen w-72 flex-col gap-4 border-r p-4">
      <Button className="w-full justify-start gap-2" size="lg">
        <Plus className="size-4" />
        タスクを追加
      </Button>
      <nav className="space-y-1">
        <Link
          href="/app"
          className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1.5 text-sm"
        >
          <Inbox className="size-4" />
          インボックス
        </Link>
      </nav>
    </div>
  );
}
