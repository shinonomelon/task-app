'use client';

import { useTask } from '../_hooks/use-task';
import { filterConfig } from '../_utils/filter-config';
import { getTitle } from '../_utils/get-title';
import { FilterBy, Task } from '../types';

import { TaskForm } from './task-form';
import { TaskItem } from './task-item';
import { TaskWrapper } from './task-wrapper';

export const TaskSection = ({
  tasks,
  filterByList
}: {
  tasks: Task[];
  filterByList: FilterBy[];
}) => {
  const { optimisticTaskList, handleToggleTask, handleDeleteTask } =
    useTask(tasks);

  return (
    <div>
      {filterByList.map((filterKey) => {
        if (!filterConfig[filterKey]) return null;

        const { filterFn, showForm } = filterConfig[filterKey];
        const filteredTasks = optimisticTaskList.filter(filterFn);

        return (
          <TaskWrapper
            key={filterKey}
            title={getTitle(filterKey)}
            count={filteredTasks.length}
          >
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                handleToggleTask={handleToggleTask}
                handleDeleteTask={handleDeleteTask}
              />
            ))}
            {showForm && <TaskForm />}
          </TaskWrapper>
        );
      })}
    </div>
  );
};
