"use client";

import { deleteTodo, toggleTodoCompleted } from "@/actions/todo";
import { format } from "date-fns";
import { useOptimistic, useTransition } from "react";

type TodoItemProps = {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
};

export function TodoItem({ id, text, completed, created_at }: TodoItemProps) {
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    completed,
    (prev, next: boolean) => next
  );

  const [optimisticDeleted, setOptimisticDeleted] = useOptimistic(
    false,
    (prev, next: boolean) => next
  );

  const [isPending, startTransition] = useTransition();

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
          disabled={isPending}
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

        <span
          className={`${
            optimisticCompleted
              ? "line-through text-gray-500 dark:text-gray-400"
              : "text-gray-700 dark:text-white"
          } text-sm sm:text-base`}
        >
          {text}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {format(new Date(created_at), "yyyy年MM月dd日")}
        </span>

        <button
          onClick={handleDelete}
          disabled={isPending}
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
      </div>
    </li>
  );
}
