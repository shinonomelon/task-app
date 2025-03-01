import { Metadata } from 'next';

import { AppHeader } from '../_components/app-header';
import { TaskCalendarView } from '../_components/task-calendar-view';

import { CustomSuspense } from '@/lib/utils/custom-suspense';

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
