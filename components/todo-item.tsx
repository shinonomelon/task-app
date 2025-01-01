"use client";

import { deleteTodo, editTodo, toggleTodoCompleted } from "@/actions/todo";
import { FocusEvent, useOptimistic, useState, useTransition } from "react";
import { formatDistance } from 'date-fns';
import { ja } from "date-fns/locale";
import { Tooltip } from "./tooltip";

type TodoItemProps = {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
};

export function TodoItem({ id, text: defaultValue, completed, created_at }: TodoItemProps) {
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    completed,
    (_, next: boolean) => next
  );

  const [optimisticDeleted, setOptimisticDeleted] = useOptimistic(
    false,
    (_, next: boolean) => next
  );

  const [ optimisticText, setOptimisticText ] = useOptimistic(
    defaultValue,
    (_, next: string) => next
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();


  const [isEditorMode, setIsEditorMode] = useState(false);

  const handleBlur =async (e: FocusEvent<HTMLInputElement>) => {
    startTransition(() => {
      setOptimisticText(e.target.value);
    })
    const inputText = e.target.value;
    setIsEditorMode(false);
    if (inputText === defaultValue) return;
    try {
      await editTodo(id, inputText);
    } catch (error) {
      startTransition(() => {
        setOptimisticText(defaultValue);
      });
      console.error("Delete failed:", error);
    }
  };

  const handleToggle = async () => {
    startTransition(() => {
      setOptimisticCompleted(!optimisticCompleted);
    });

    try {
      await toggleTodoCompleted(id, !optimisticCompleted);

    } catch (error) {
      startTransition(() => {
        setOptimisticCompleted(completed);
      });
      console.error("Delete failed:", error);
    }
  };

  const handleDelete = async () => {
    startTransition(() => {
      setOptimisticDeleted(true);
    });

    try {
      await deleteTodo(id);
    } catch (error) {
      startTransition(() => {
        setOptimisticDeleted(false);
      });
      console.error("Delete failed:", error);
    }
  };

  if (optimisticDeleted) {
    return null;
  }

  return (
    <li
      key={id}
      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
    >
      <div className="flex items-center space-x-3">
        <button
          onClick={handleToggle}
          className={`w-5 h-5 rounded-full border-2 ${
            optimisticCompleted
              ? "bg-blue-500 border-blue-500"
              : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          }`}
        >
          {optimisticCompleted && (
            <svg
              className="w-3 h-3 text-white mx-auto"
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
        </button>
        {
          isEditorMode ? (
            <input
            className="rounded border border-gray-300 p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-300"
            autoFocus
            defaultValue={
              optimisticText
            }
            onBlur={handleBlur}
          />
          ) : (
            <p className="px-4 py-2">{
              optimisticText
            }</p>
          )
        }

      </div>

      <div className="flex items-center space-x-2">
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {formatDistance(new Date(created_at), new Date(), {addSuffix: true, locale: ja})}
        </span>
        <Tooltip label="Edit">

        <button
              className="rounded bg-green-200 px-2 py-1 text-gray-400 shadow-md hover:opacity-70"
              onClick={() => setIsEditorMode(true)}
            >
              🖊️
        </button>
        </Tooltip>
        <Tooltip label="Delete">
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
        </Tooltip>
      </div>
    </li>
  );
}
