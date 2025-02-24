import { useCallback, useState } from 'react';

import { useOptimisticAction } from './use-optimistic-action';

import { DisplayTask } from '@/types/task';

import { deleteTask } from '@/actions/task/delete-task';
import { deleteTaskList } from '@/actions/task/delete-task-list';
import { toggleTaskCompleted } from '@/actions/task/toggle-task-complated';

export const useTask = (tasks: DisplayTask[]) => {
  const { optimisticList: optimisticTaskList, execute } =
    useOptimisticAction<DisplayTask>(tasks);

  const handleToggleTask = useCallback(
    ({ id, completed }: { id: string; completed: boolean }) => {
      execute(
        (prev) =>
          prev.map((task) =>
            task.id === id ? { ...task, completed: !completed } : task
          ),
        () => toggleTaskCompleted(id, !completed),
        () => toggleTaskCompleted(id, completed)
      );
    },
    [execute]
  );

  const handleDeleteTask = useCallback(
    ({ id }: { id: string }) => {
      execute(
        (prev) => prev.filter((task) => task.id !== id),
        () => deleteTask(id)
      );
    },
    [execute]
  );

  const [selectedTaskIdList, setSelectedTaskIdList] = useState<string[]>([]);
  const handleToggleSelect = (selectedTaskId: string) => {
    setSelectedTaskIdList((prev) =>
      prev.includes(selectedTaskId)
        ? prev.filter((id) => id !== selectedTaskId)
        : [...prev, selectedTaskId]
    );
  };

  const handleDeleteTaskList = useCallback(() => {
    const tasksToDelete = selectedTaskIdList;

    setSelectedTaskIdList([]);

    execute(
      (prev) => prev.filter((task) => !tasksToDelete.includes(task.id)),
      () => deleteTaskList(tasksToDelete)
    );
  }, [execute, selectedTaskIdList]);

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
