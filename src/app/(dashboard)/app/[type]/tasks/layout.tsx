import { Metadata } from 'next';

import { CustomSuspense } from '@/lib/utils/custom-suspense';

import { AppHeader } from '@/components/app-header';
import { TaskCalendarView } from '@/components/task/task-calendar-view';
import { TaskListView } from '@/components/task/task-list-view';

import { getTaskList } from '@/actions/api/task';

const getTitle = (type: string) => {
  switch (type) {
    case 'inbox':
      return 'インボックス';
    case 'today':
      return '今日のタスク';
    default:
      return 'カレンダー';
  }
};

export const generateMetadata = async ({
  params
}: {
  params: { type: string };
}): Promise<Metadata> => {
  const title = getTitle(params.type);
  return { title };
};

export default async function Page({
  detail,
  params
}: {
  detail: React.ReactNode;
  params: { type: string };
}) {
  const title = getTitle(params.type);
  const promiseTaskList = getTaskList();

  return (
    <div className="flex h-full">
      <div className="flex-1 p-2">
        <AppHeader title={title} />
        {/* タスクリスト */}
        <CustomSuspense height={100} width="100%">
          {title === 'カレンダー' && (
            <TaskCalendarView promiseTaskList={promiseTaskList} />
          )}
          {title === 'インボックス' && (
            <TaskListView
              promiseTaskList={promiseTaskList}
              filterByList={['all', 'completed']}
            />
          )}
          {title === '今日のタスク' && (
            <TaskListView
              promiseTaskList={promiseTaskList}
              filterByList={['overdue', 'today']}
            />
          )}
        </CustomSuspense>
      </div>
      {title !== 'カレンダー' && (
        <div className="hidden w-96 border-l p-2 lg:block">{detail}</div>
      )}
    </div>
  );
}
