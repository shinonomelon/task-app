'use client';

import { format, isSameYear, isToday, isTomorrow, isYesterday } from 'date-fns';
import { Trash } from 'lucide-react';
import { useState } from 'react';

import { EditTaskDialog } from './edit-task-dialog';

import { DisplayTask } from '@/types/task';

import { cn } from '@/lib/utils/cn';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export const TaskItem = ({
  task,
  handleToggleTask,
  handleDeleteTask,
  isSelected,
  handleToggleSelect
}: {
  task: DisplayTask;
  handleToggleTask: ({
    id,
    completed
  }: {
    id: string;
    completed: boolean;
  }) => void;
  handleDeleteTask: ({ id }: { id: string }) => void;
  isSelected: boolean;
  handleToggleSelect: (id: string) => void;
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <li className="group relative ml-2 flex flex-col gap-1 border-b">
      <div className="flex items-center justify-between">
        <Checkbox
          checked={isSelected}
          onClick={() => handleToggleSelect(task.id)}
          className={cn(
            'mr-4 opacity-0 transition duration-300 group-hover:opacity-100',
            {
              'opacity-100': isSelected
            }
          )}
          aria-label="タスクの選択"
        />
        <div className="flex flex-1 items-center space-x-3">
          <Checkbox
            onClick={() =>
              handleToggleTask({ id: task.id, completed: task.completed })
            }
            checked={task.completed}
            className={cn('size-6 border-2', {
              'border-red-600 bg-red-100': task.priority === 'high',
              'border-yellow-600 bg-yellow-100': task.priority === 'medium',
              'opacity-40': task.completed
            })}
            aria-label="タスクの完了・未完了の切り替え"
          />
          <EditTaskDialog
            task={task}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          >
            <div
              role="button"
              tabIndex={0}
              className={cn('py-3 w-full cursor-pointer', {
                'opacity-40': task.completed
              })}
            >
              {task.title}
            </div>
          </EditTaskDialog>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            {task.tags?.[0] && (
              <div
                key={task.tags[0].id}
                style={{ backgroundColor: task.tags[0].color }}
                className={cn(
                  'rounded-full px-2 py-1 text-xs mix-blend-difference'
                )}
              >
                {task.tags[0].name}
              </div>
            )}
            {task.tags.length > 1 && (
              <div className="rounded-full bg-gray-200 px-2 py-1 text-xs">
                {task.tags.length - 1} つのタグ
              </div>
            )}
          </div>
          {task.deadline && (
            <span
              className={cn({
                'text-blue-500': isToday(new Date(task.deadline)),
                'text-red-500':
                  new Date(task.deadline).getDate() < new Date().getDate(),
                'text-gray-700':
                  new Date(task.deadline).getDate() > new Date().getDate()
              })}
            >
              {(() => {
                const deadlineDate = new Date(task.deadline);

                if (isToday(deadlineDate)) {
                  let label = '今日';
                  if (task.include_time) {
                    label += ` ${format(deadlineDate, 'HH:mm')}`;
                  }
                  return label;
                } else if (isTomorrow(deadlineDate)) {
                  return '明日';
                } else if (isYesterday(deadlineDate)) {
                  return '昨日';
                } else if (isSameYear(deadlineDate, new Date())) {
                  return format(deadlineDate, 'M月dd日');
                } else {
                  return format(deadlineDate, 'yyyy年M月dd日');
                }
              })()}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteTask({ id: task.id })}
            className="opacity-0 transition duration-300 group-hover:opacity-100"
            aria-label="タスクの削除"
          >
            <Trash />
          </Button>
        </div>
      </div>
    </li>
  );
};
