'use client';

import { format, isSameYear, isToday, isTomorrow, isYesterday } from 'date-fns';
import { Trash } from 'lucide-react';
import { useState } from 'react';

import { Task } from '../types';

import { EditTaskDialog } from './edit-task-dialog';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export const TaskItem = ({
  task,
  handleToggleTask,
  handleDeleteTask
}: {
  task: Task;
  handleToggleTask: ({
    id,
    completed
  }: {
    id: string;
    completed: boolean;
  }) => void;
  handleDeleteTask: ({ id }: { id: string }) => void;
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <li
      key={task.id}
      className="group relative ml-2 flex flex-col gap-1 border-b py-1 "
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-3">
          <Checkbox
            onClick={() =>
              handleToggleTask({ id: task.id, completed: task.completed })
            }
            checked={task.completed}
            className={cn('size-5 rounded-full border-2 border-gray-500', {
              'border-red-600': task.priority === 'high',
              'border-yellow-600': task.priority === 'medium',
              'opacity-40': task.completed
            })}
          />

          <span
            className={cn('py-2 w-full cursor-pointer', {
              'opacity-40': task.completed
            })}
            role="button"
            onClick={() => setIsEditDialogOpen(true)}
            tabIndex={0}
          >
            {task.text}
          </span>
        </div>
        <div className="flex items-center space-x-2">
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
                  return '今日';
                } else if (isTomorrow(deadlineDate)) {
                  return '明日';
                } else if (isYesterday(deadlineDate)) {
                  return '昨日';
                } else if (isSameYear(deadlineDate, new Date())) {
                  return format(deadlineDate, 'MM月dd日');
                } else {
                  return format(deadlineDate, 'yyyy年MM月dd日');
                }
              })()}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteTask({ id: task.id })}
            className="opacity-0 transition duration-300 group-hover:opacity-100"
          >
            <Trash />
          </Button>
        </div>
      </div>
      <EditTaskDialog
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </li>
  );
};
