import { startTransition, useCallback, useOptimistic, useState } from 'react';
import { toast } from 'sonner';

import { DisplayTask } from '@/types/task';

import { deleteTask } from '@/actions/task/delete-task';
import { deleteTaskList } from '@/actions/task/delete-task-list';
import { toggleTaskCompleted } from '@/actions/task/toggle-task-complated';

export const useTask = (tasks: DisplayTask[]) => {
  const [optimisticTaskList, setOptimisticTaskList] = useOptimistic(
    tasks,
    (_, newState: DisplayTask[]) => newState
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

  const handleToggleSelect = (selectedTaskId: string) => {
    setSelectedTaskIdList((prev) => {
      if (prev.includes(selectedTaskId)) {
        return prev.filter((id) => id !== selectedTaskId);
      } else {
        return [...prev, selectedTaskId];
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
