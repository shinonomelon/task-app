import { Metadata } from 'next';

import { AppHeader } from '../_components/app-header';
import { TaskListView } from '../_components/task-list-view';

import { CustomSuspense } from '@/lib/utils/custom-suspense';

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
