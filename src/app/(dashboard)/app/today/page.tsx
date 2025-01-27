import { LoaderCircle } from 'lucide-react';
import { Metadata } from 'next';
import { Suspense } from 'react';

import { TaskList } from '../_components/task-list';

export const metadata: Metadata = {
  title: '今日'
};

export default async function Page() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">今日</h1>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <LoaderCircle className="size-6 animate-spin" />
          </div>
        }
      >
        <TaskList filterByList={['overdue', 'today']} />
      </Suspense>
    </>
  );
}
