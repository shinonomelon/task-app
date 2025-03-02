import { Metadata } from 'next';

import { CustomSuspense } from '@/lib/utils/custom-suspense';

import { AppHeader } from '@/components/app-header';
import { TaskSummary } from '@/components/task/task-summary';

export const metadata: Metadata = {
  title: 'ダッシュボード'
};

export default function DashboardPage() {
  return (
    <>
      <AppHeader title="ダッシュボード" />
      <CustomSuspense height={100} width="100%">
        <TaskSummary />
      </CustomSuspense>
    </>
  );
}
