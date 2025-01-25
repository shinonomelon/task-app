import { startTransition, useCallback, useOptimistic, useState } from 'react';
import { toast } from 'sonner';

import { deleteTask } from '../_actions/delate-task';
import { deleteTaskList } from '../_actions/delete-task-list';
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

  const [selectedTaskIdList, setSelectedTaskIdList] = useState<string[]>([]);

  const handleToggleSelect = (id: string) => {
    setSelectedTaskIdList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((id) => id !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleDeleteTaskList = useCallback(() => {
    setSelectedTaskIdList([]);

    startTransition(async () => {
      const previousTaskList = optimisticTaskList;
      const newTaskList = previousTaskList.filter(
        (task) => !selectedTaskIdList.includes(task.id)
      );
      setOptimisticTaskList(newTaskList);

      const response = await deleteTaskList(selectedTaskIdList);
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
  }, [optimisticTaskList, setOptimisticTaskList, selectedTaskIdList]);

  return {
    optimisticTaskList,
    handleToggleTask,
    handleDeleteTask,
    handleToggleSelect,
    handleDeleteTaskList,
    selectedTaskIdList,
    setSelectedTaskIdList
  };
};
