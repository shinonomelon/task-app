import { Metadata } from 'next';

import { CustomSuspense } from '@/lib/utils/custom-suspense';

import { AppHeader } from '@/components/app-header';
import { TaskCalendarView } from '@/components/task/task-calendar-view';

import { getTaskList } from '@/actions/api/task';

export const metadata: Metadata = {
  title: 'カレンダー'
};

export default async function Page() {
  return (
    <>
      <AppHeader title="カレンダー" />
      <CustomSuspense height={100} width="100%">
        <TaskView />
      </CustomSuspense>
    </>
  );
}

const TaskView = async () => {
  const { data: tasks } = await getTaskList();

  return <TaskCalendarView tasks={tasks} />;
};
