import { Metadata } from 'next';

import { CustomSuspense } from '@/lib/utils/custom-suspense';

import { AppHeader } from '@/components/app-header';
import { TaskListView } from '@/components/task/task-list-view';

import { getTaskList } from '@/actions/api/task';

export const metadata: Metadata = {
  title: '今日'
};

export default async function Page() {
  return (
    <>
      <AppHeader title="今日" />
      <CustomSuspense height={100} width="100%">
        <TaskView />
      </CustomSuspense>
    </>
  );
}

const TaskView = async () => {
  const { data: tasks } = await getTaskList();

  return <TaskListView tasks={tasks} filterByList={['overdue', 'today']} />;
};
