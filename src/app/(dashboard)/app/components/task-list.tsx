import { fetchTasks, FilterBy } from '../queries';
import { Task } from '../types';

import { TaskItem } from './task-item';
import { TaskSection } from './task-selection';

interface TaskListProps {
  filterBy: FilterBy;
}

export const TaskList = async ({ filterBy }: TaskListProps) => {
  const title = getTitle(filterBy);

  const { tasks, error } = await fetchTasks(filterBy);

  if (error) {
    return (
      <div className="rounded-lg bg-red-100 p-4 text-red-500" role="alert">
        エラーが発生しました: {error.message}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return null;
  }

  return (
    <TaskSection title={title} count={tasks.length}>
      <ul>
        {tasks.map((task: Task) => (
          <TaskItem key={task.id} filterBy={filterBy} {...task} />
        ))}
      </ul>
    </TaskSection>
  );
};

const getTitle = (filterBy: FilterBy): string => {
  switch (filterBy) {
    case 'completed':
      return '完了したタスク';
    case 'today':
      return '今日のタスク';
    case 'overdue':
      return '期限切れのタスク';
    case 'all':
    default:
      return 'すべてのタスク';
  }
};
