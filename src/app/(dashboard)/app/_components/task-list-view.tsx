'use client';

import { Trash2 } from 'lucide-react';

import { TaskForm } from './task-form';
import { TaskItem } from './task-item';
import { TaskWrapper } from './task-wrapper';

import { DisplayTask, FilterBy } from '@/types/task';

import { filterConfig } from '@/lib/utils/filter-config';
import { getTitle } from '@/lib/utils/get-title';

import { Button } from '@/components/ui/button';

import { useSearchStore } from '@/hooks/use-search';
import { useTask } from '@/hooks/use-task';

export const TaskListView = ({
  tasks,
  filterByList
}: {
  tasks: DisplayTask[];
  filterByList: FilterBy[];
}) => {
  const {
    optimisticTaskList,
    handleToggleTask,
    handleDeleteTask,
    handleToggleSelect,
    handleDeleteTaskList,
    selectedTaskIdList,
    setSelectedTaskIdList
  } = useTask(tasks);

  const { searchQuery } = useSearchStore();

  return (
    <>
      <TaskNav
        handleDeleteTaskList={handleDeleteTaskList}
        selectedTaskIdList={selectedTaskIdList}
        setSelectedTaskIdList={setSelectedTaskIdList}
      />

      {filterByList.map((filterKey) => {
        if (!filterConfig[filterKey]) return null;

        const { filterFn, showForm } = filterConfig[filterKey];
        const filteredTaskList = optimisticTaskList
          .filter(filterFn)
          .filter((task) => task.text.includes(searchQuery));

        return (
          <TaskWrapper
            key={filterKey}
            title={getTitle(filterKey)}
            count={filteredTaskList.length}
          >
            {filteredTaskList.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                handleToggleTask={handleToggleTask}
                handleDeleteTask={handleDeleteTask}
                isSelected={selectedTaskIdList.includes(task.id)}
                handleToggleSelect={handleToggleSelect}
              />
            ))}
            {showForm && <TaskForm />}
          </TaskWrapper>
        );
      })}
    </>
  );
};

const TaskNav = ({
  handleDeleteTaskList,
  selectedTaskIdList,
  setSelectedTaskIdList
}: {
  handleDeleteTaskList: () => void;
  selectedTaskIdList: string[];
  setSelectedTaskIdList: (taskIdList: string[]) => void;
}) => {
  if (selectedTaskIdList.length === 0) return null;
  return (
    <div className="mb-4 flex max-w-fit items-center rounded-sm border bg-white shadow-sm">
      <Button
        variant="ghost"
        className="text-blue-600 hover:text-blue-700"
        onClick={() => setSelectedTaskIdList([])}
      >
        {selectedTaskIdList.length}件選択済み
      </Button>
      <div className="h-4 w-px bg-gray-200" />
      <Button
        variant="ghost"
        className="text-red-600 hover:text-red-700"
        onClick={handleDeleteTaskList}
      >
        <Trash2 className="size-4" />
        まとめて削除
      </Button>
    </div>
  );
};
