import { Metadata } from 'next';

import { CustomSuspense } from '@/lib/utils/custom-suspense';

import { AppHeader } from '@/components/app-header';
import { TaskListView } from '@/components/task/task-list-view';

import { getTaskList } from '@/actions/api/task';

export const metadata: Metadata = {
  title: 'インボックス'
};

export default async function Page() {
  return (
    <>
      <AppHeader title="インボックス" />
      <CustomSuspense height={100} width="100%">
        <TaskView />
      </CustomSuspense>
    </>
  );
}

const TaskView = async () => {
  const { data: tasks } = await getTaskList();
  return <TaskListView tasks={tasks} filterByList={['all', 'completed']} />;
};
