'use client';

import { formatDistance } from 'date-fns';
import { ja } from 'date-fns/locale';
import { FocusEvent, useOptimistic, useState, useTransition } from 'react';

import { deleteTodo, editTodo, toggleTodoCompleted } from '@/src/actions/task';
import { Checkbox } from '@/src/components/ui/checkbox';

type TodoItemProps = {
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
}: TodoItemProps) => {
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
      await editTodo(id, inputText);
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
      await toggleTodoCompleted(id, !optimisticCompleted);
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
      await deleteTodo(id);
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
      className="group relative flex flex-col gap-1 border-b bg-white px-4 py-1 dark:bg-gray-800"
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
            <input
              className="rounded border border-gray-300 p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-300"
              autoFocus
              defaultValue={optimisticText}
              onBlur={handleBlur}
            />
          ) : (
            <p
              className={`px-4 py-2 ${
                optimisticCompleted ? 'line-through' : ''
              }`}
            >
              {optimisticText}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            {formatDistance(new Date(created_at), new Date(), {
              addSuffix: true,
              locale: ja
            })}
          </span>
          <button
            className="rounded bg-green-200 px-2 py-1 text-gray-400 shadow-md hover:opacity-70"
            onClick={() => setIsEditorMode(true)}
          >
            🖊️
          </button>
          <button
            onClick={handleDelete}
            className="rounded-full p-1 text-red-600 transition-colors duration-150 ease-in-out hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-red-400 dark:hover:text-red-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
};
