'use client';

import { formatDistance } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Pencil, Trash } from 'lucide-react';
import { FocusEvent, useOptimistic, useState, useTransition } from 'react';

import { deleteTask, editTask, toggleTaskCompleted } from '../actions';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

type TaskItemProps = {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
};

export const TaskItem = ({
  id,
  text: defaultValue,
  completed,
  created_at
}: TaskItemProps) => {
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
            className="size-5 rounded-full border-2"
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
            <div
              className={`py-2 ${optimisticCompleted ? 'line-through' : ''}`}
            >
              {optimisticText}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            {formatDistance(new Date(created_at), new Date(), {
              addSuffix: true,
              locale: ja
            })}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditorMode(true)}
          >
            <Pencil />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash />
          </Button>
        </div>
      </div>
    </li>
  );
};
