import { startTransition, useCallback, useOptimistic } from 'react';
import { toast } from 'sonner';

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
        const previousTaskList = optimisticTaskList;

        const newTaskList = previousTaskList.map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        );

        setOptimisticTaskList(newTaskList);

        try {
          await toggleTaskCompleted(id, !completed);
          toast.success(
            completed
              ? '1件のタスクを未完了にしました'
              : '1件のタスクを完了しました',
            {
              action: {
                label: '取り消す',
                onClick: () =>
                  startTransition(async () => {
                    const previousTaskList = optimisticTaskList.map((task) =>
                      task.id === id ? { ...task, completed } : task
                    );
                    setOptimisticTaskList(previousTaskList);
                    await toggleTaskCompleted(id, completed);
                  })
              }
            }
          );
        } catch (error) {
          setOptimisticTaskList(previousTaskList);
          toast.error('タスクの完了状態の切り替えに失敗しました');
          console.error('タスクの完了状態の切り替えに失敗しました:', error);
        }
      });
    },
    [optimisticTaskList, setOptimisticTaskList]
  );

  const handleDeleteTask = useCallback(
    ({ id }: { id: string }) => {
      startTransition(async () => {
        const previousTaskList = optimisticTaskList;
        const newTaskList = previousTaskList.filter((task) => task.id !== id);
        setOptimisticTaskList(newTaskList);

        try {
          await deleteTask(id);
          toast.success('タスクを削除しました');
        } catch (error) {
          setOptimisticTaskList(previousTaskList);
          toast.error('タスクの削除に失敗しました');
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
