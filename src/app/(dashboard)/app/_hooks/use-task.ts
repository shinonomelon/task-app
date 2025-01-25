import { startTransition, useCallback, useOptimistic } from 'react';

import { deleteTask } from '../_actions/delate-task';
import { toggleTaskCompleted } from '../_actions/toggle-task-complated';
import { Task } from '../types';

export const useTask = (tasks: Task[]) => {
  const [optimisticTaskList, setOptimisticTaskList] = useOptimistic(
    tasks,
    (_, newState: Task[]) => newState
  );

  const handleToggleTask = useCallback(
    ({ id, completed }: { id: string; completed: boolean }) => {
      startTransition(async () => {
        const previousTasks = optimisticTaskList;
        const updatedList = previousTasks.map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        );
        setOptimisticTaskList(updatedList);
        try {
          await toggleTaskCompleted(id, !completed);
        } catch (error) {
          setOptimisticTaskList(previousTasks);
          console.error('タスクの完了状態の切り替えに失敗しました:', error);
        }
      });
    },
    [optimisticTaskList, setOptimisticTaskList]
  );

  const handleDeleteTask = useCallback(
    ({ id }: { id: string }) => {
      startTransition(async () => {
        const previousTasks = optimisticTaskList;
        const updatedList = previousTasks.filter((task) => task.id !== id);
        setOptimisticTaskList(updatedList);
        try {
          await deleteTask(id);
        } catch (error) {
          setOptimisticTaskList(previousTasks);
          console.error('タスクの削除に失敗しました:', error);
        }
      });
    },
    [optimisticTaskList, setOptimisticTaskList]
  );

  return {
    optimisticTaskList,
    handleToggleTask,
    handleDeleteTask
  };
};
