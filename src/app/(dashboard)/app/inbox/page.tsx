import { LoaderCircle } from 'lucide-react';
import { Metadata } from 'next';
import { Suspense } from 'react';

import { TaskList } from '../_components/task-list';

export const metadata: Metadata = {
  title: 'インボックス'
};

export default async function Page() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">インボックス</h1>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <LoaderCircle className="size-6 animate-spin" />
          </div>
        }
      >
        <TaskList filterByList={['all', 'completed']} />
      </Suspense>
    </>
  );
}
