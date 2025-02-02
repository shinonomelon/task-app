import { Metadata } from 'next';

import { TaskCalendarView } from '../_components/task-calendar-view';
import { TaskListView } from '../_components/task-list-view';
import { TaskViewBar } from '../_components/task-view-bar';

import { CustomSuspense } from '@/lib/utils/custom-suspense';

import { getTaskList } from '@/actions/api/task';

export const metadata: Metadata = {
  title: 'インボックス'
};

type SearchParams = Promise<{ view?: string }>;

export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const view = searchParams.view;

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">インボックス</h1>
      <TaskViewBar />
      <CustomSuspense height={100} width="100%">
        <TaskView view={view} />
      </CustomSuspense>
    </>
  );
}

const TaskView = async ({ view }: { view?: string }) => {
  const { data: tasks } = await getTaskList();

  return !view || view === 'list' ? (
    <TaskListView tasks={tasks} filterByList={['all', 'completed']} />
  ) : (
    <TaskCalendarView tasks={tasks} />
  );
};
