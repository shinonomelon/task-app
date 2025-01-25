import { Suspense } from 'react';

import { TaskList } from '../_components/task-list';

export default async function Page() {
  return (
    <div className="p-6 pb-24 pl-80">
      <h1 className="mb-4 text-2xl font-bold">今日</h1>
      <Suspense
        fallback={
          <div className="text-center text-gray-500">読み込み中...</div>
        }
      >
        <TaskList filterByList={['overdue', 'today']} />
      </Suspense>
    </div>
  );
}
