'use client';

import { Trash2 } from 'lucide-react';
import { use } from 'react';

import { TaskForm } from './task-form';
import { TaskItem } from './task-item';
import { TaskWrapper } from './task-wrapper';

import { DisplayTask, FilterBy } from '@/types/task';

import { filterConfig } from '@/lib/utils/filter-config';
import { getTitle } from '@/lib/utils/get-title';

import { Button } from '@/components/ui/button';

import { useLocalSearchStore } from '@/hooks/use-local-search';
import { useTask } from '@/hooks/use-task';

export const TaskListView = ({
  promiseTaskList,
  filterByList,
  filterByTagId
}: {
  promiseTaskList: Promise<DisplayTask[]>;
  filterByList: FilterBy[];
  filterByTagId?: string;
}) => {
  const taskList = use(promiseTaskList).filter((task) =>
    filterByTagId ? task.tags.some((tag) => tag.id === filterByTagId) : true
  );

  const {
    optimisticTaskList,
    handleToggleTask,
    handleDeleteTask,
    handleToggleSelect,
    handleDeleteTaskList,
    selectedTaskIdList,
    setSelectedTaskIdList
  } = useTask(taskList);

  const { searchQuery } = useLocalSearchStore();

  return (
    <div className="flex-1 overflow-auto">
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
          .filter((task) => task.title.includes(searchQuery));

        return (
          <TaskWrapper
            key={filterKey}
            title={getTitle(filterKey)}
            count={filteredTaskList.length}
          >
            <ul>
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
            </ul>
            {showForm && <TaskForm />}
          </TaskWrapper>
        );
      })}
    </div>
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
        aria-label="選択済みタスクの数をクリア"
      >
        {selectedTaskIdList.length}件選択済み
      </Button>
      <div className="h-4 w-px bg-gray-200" />
      <Button
        variant="ghost"
        className="text-red-600 hover:text-red-700"
        onClick={handleDeleteTaskList}
        aria-label="選択済みタスクをまとめて削除"
      >
        <Trash2 className="size-4" />
        まとめて削除
      </Button>
    </div>
  );
};
