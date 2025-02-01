import { TaskSection } from './task-selection';

import { FilterBy } from '@/types/task';

import { getTaskList } from '@/actions/api/task';

export const TaskList = async ({
  filterByList
}: {
  filterByList: FilterBy[];
}) => {
  const { data: tasks } = await getTaskList();

  if (!tasks) {
    return null;
  }

  return <TaskSection tasks={tasks} filterByList={filterByList} />;
};
