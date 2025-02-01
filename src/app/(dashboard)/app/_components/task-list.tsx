import { TaskSection } from './task-selection';

import { FilterBy } from '@/types/task';

import { getTaskList } from '@/actions/api/task';

export const TaskList = async ({
  filterByList
}: {
  filterByList: FilterBy[];
}) => {
  const { data: tasks, error } = await getTaskList();

  if (error) {
    return (
      <div className="rounded-lg bg-red-100 p-4 text-red-500" role="alert">
        エラーが発生しました: {error.message}
      </div>
    );
  }

  if (!tasks) {
    return null;
  }

  return <TaskSection tasks={tasks} filterByList={filterByList} />;
};
