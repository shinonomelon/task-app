import { Inbox } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
  return (
    <div className="fixed flex h-screen w-72 flex-col gap-4 border-r p-4">
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
