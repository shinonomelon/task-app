import { Metadata } from 'next';

import { AppHeader } from './_components/app-header';
import { TaskSummary } from './_components/task-summary';

import { CustomSuspense } from '@/lib/utils/custom-suspense';

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
