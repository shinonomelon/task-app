'use client';

import { format, isSameYear, isToday, isTomorrow, isYesterday } from 'date-fns';
import { Trash } from 'lucide-react';
import { useOptimistic, useState, useTransition } from 'react';

import { deleteTask } from '../actions/delate-task';
import { toggleTaskCompleted } from '../actions/toggle-task-complated';
import { Task } from '../types';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export const TaskItem = ({ id, text, completed, deadline, priority }: Task) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    completed,
    (_, next: boolean) => next
  );

  const [optimisticDeleted, setOptimisticDeleted] = useOptimistic(
    false,
    (_, next: boolean) => next
  );

  const [, startTransition] = useTransition();

  const handleToggle = async () => {
    startTransition(() => {
      setOptimisticCompleted(!optimisticCompleted);
    });

    try {
      await toggleTaskCompleted(id, !optimisticCompleted);
    } catch (error) {
      setErrorMessage('完了ステータスの変更に失敗しました。');
      startTransition(() => {
        setOptimisticCompleted(completed);
      });
      console.error('Toggle failed:', error);
    }
  };

  const handleDelete = async () => {
    startTransition(() => {
      setOptimisticDeleted(true);
    });

    try {
      await deleteTask(id);
    } catch (error) {
      setErrorMessage('削除に失敗しました。');
      startTransition(() => {
        setOptimisticDeleted(false);
      });
      console.error('Delete failed:', error);
    }
  };

  if (optimisticDeleted) {
    return null;
  }

  return (
    <li
      key={id}
      className="group relative ml-2 flex flex-col gap-1 border-b bg-white py-1 dark:bg-gray-800"
    >
      {errorMessage && (
        <div className="mb-2 bg-red-100 p-2 text-red-700">{errorMessage}</div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Checkbox
            onClick={handleToggle}
            checked={optimisticCompleted}
            className={cn('size-5 rounded-full border-2 border-gray-500', {
              'border-red-600': priority === 'high',
              'border-red-400': priority === 'medium',
              'opacity-40': optimisticCompleted
            })}
          >
            {optimisticCompleted && (
              <svg
                className="mx-auto size-3 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </Checkbox>

          <span
            className={cn('py-2', {
              'opacity-40': optimisticCompleted
            })}
          >
            {text}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {deadline && (
            <span
              className={cn({
                'text-blue-500': isToday(new Date(deadline)),
                'text-red-500':
                  new Date(deadline).getDate() < new Date().getDate(),
                'text-gray-700':
                  new Date(deadline).getDate() > new Date().getDate()
              })}
            >
              {(() => {
                const deadlineDate = new Date(deadline);

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
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash />
          </Button>
        </div>
      </div>
    </li>
  );
};
