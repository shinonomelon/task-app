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

        const response = await toggleTaskCompleted(id, !completed);

        if (response.success) {
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
        } else {
          setOptimisticTaskList(previousTaskList);
          toast.error(response.message, {
            style: {
              background: 'red',
              color: 'white'
            }
          });
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

        const response = await deleteTask(id);

        if (response.success) {
          toast.success(response.message);
        } else {
          setOptimisticTaskList(previousTaskList);
          toast.error(response.message, {
            style: {
              background: 'red',
              color: 'white'
            }
          });
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
