import { Metadata } from 'next';

import { TaskSummary } from './_components/task-summary';

import { CustomSuspense } from '@/lib/utils/custom-suspense';

export const metadata: Metadata = {
  title: 'ダッシュボード'
};

export default function DashboardPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        ダッシュボード
      </h1>

      <CustomSuspense height={100} width="100%">
        <TaskSummary />
      </CustomSuspense>
    </>
  );
}
