"use client";

import { toggleTodoCompleted } from "@/actions/todo";

type ToggleButtonProps = {
  id: number;
  completed: boolean;
};

export function ToggleButton({ id, completed }: ToggleButtonProps) {
  const handleToggle = async () => {
    await toggleTodoCompleted(id, !completed);
  };

  return (
    <button
      onClick={handleToggle}
      className={`w-5 h-5 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        completed
          ? "bg-blue-500 border-blue-500"
          : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
      }`}
    >
      {completed && (
        <svg
          className="w-3 h-3 text-white mx-auto"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 13l4 4L19 7"></path>
        </svg>
      )}
    </button>
  );
}
