'use client';

import { format, isSameYear, isToday, isTomorrow, isYesterday } from 'date-fns';
import { Trash } from 'lucide-react';
import { FocusEvent, useOptimistic, useState, useTransition } from 'react';

import { deleteTask, editTask, toggleTaskCompleted } from '../actions';
import { Task } from '../types';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

export const TaskItem = ({
  id,
  text: defaultValue,
  completed,
  deadline,
  priority
}: Task) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    completed,
    (_, next: boolean) => next
  );

  const [optimisticDeleted, setOptimisticDeleted] = useOptimistic(
    false,
    (_, next: boolean) => next
  );

  const [optimisticText, setOptimisticText] = useOptimistic(
    defaultValue,
    (_, next: string) => next
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();

  const [isEditorMode, setIsEditorMode] = useState(false);

  const handleBlur = async (e: FocusEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    setIsEditorMode(false);

    if (inputText === defaultValue) return;

    startTransition(() => {
      setOptimisticText(inputText);
    });

    try {
      await editTask(id, inputText);
    } catch (error) {
      setErrorMessage('編集に失敗しました。もう一度お試しください。');
      startTransition(() => {
        setOptimisticText(defaultValue);
      });
      console.error('Edit failed:', error);
    }
  };

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
              'border-red-600': priority === 3,
              'border-red-400': priority === 2,
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

          {isEditorMode ? (
            <Input
              className="py-2"
              autoFocus
              defaultValue={optimisticText}
              onBlur={handleBlur}
            />
          ) : (
            <span
              className={`py-2 ${optimisticCompleted ? 'opacity-40' : ''} cursor-pointer`}
              onClick={() => setIsEditorMode(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setIsEditorMode(true);
                }
              }}
            >
              {optimisticText}
            </span>
          )}
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
