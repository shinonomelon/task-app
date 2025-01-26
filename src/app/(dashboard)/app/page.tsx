import { LoaderCircle } from 'lucide-react';
import { Suspense } from 'react';

import { TaskSummary } from './_components/task-summary';

export default async function DashboardPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        ダッシュボード
      </h1>
      <div className="space-y-6">
        <Suspense
          fallback={
            <div className="flex items-center justify-center">
              <LoaderCircle className="size-6 animate-spin" />
            </div>
          }
        >
          <TaskSummary />
        </Suspense>
      </div>
    </>
  );
}
