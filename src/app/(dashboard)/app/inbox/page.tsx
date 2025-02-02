import { Metadata } from 'next';

import { TaskCalendarView } from '../_components/task-calendar-view';
import { TaskListView } from '../_components/task-list-view';
import { TaskViewBar } from '../_components/task-view-bar';

import { getTaskList } from '@/actions/api/task';

export const metadata: Metadata = {
  title: 'インボックス'
};

type SearchParams = Promise<{ view?: string }>;

export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const view = searchParams.view;

  const { data: tasks } = await getTaskList();

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">インボックス</h1>
      <TaskViewBar />
      {!view || view === 'list' ? (
        <TaskListView tasks={tasks} filterByList={['all', 'completed']} />
      ) : (
        <TaskCalendarView tasks={tasks} />
      )}
    </>
  );
}
