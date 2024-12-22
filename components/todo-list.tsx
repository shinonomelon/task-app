import { supabase } from "@/lib/supabase";
import { Todo } from "@/types/todo";
import { format } from "date-fns";
import { Suspense } from "react";
import { ToggleButton } from "./toggle-button";
import { DeleteButton } from "./delete-buton";

export async function TodoList() {
  const { data, error } = await supabase.from("todos").select("*");

  if (error) {
    return (
      <div
        className="text-red-500 bg-red-100 dark:bg-red-900 p-4 rounded-lg"
        role="alert"
      >
        エラーが発生しました: {error.message}
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="text-gray-500 dark:text-gray-400 text-center">
          読み込み中...
        </div>
      }
    >
      <ul className="space-y-3" role="list">
        {data?.map((todo: Todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <div className="flex items-center space-x-3">
              <ToggleButton id={todo.id} completed={todo.completed} />
              <span
                className={`${
                  todo.completed
                    ? "line-through text-gray-500 dark:text-gray-400"
                    : "text-gray-700 dark:text-white"
                } text-sm sm:text-base`}
              >
                {todo.text}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(todo.created_at), "yyyy年MM月dd日")}
              </span>
              <DeleteButton id={todo.id} />
            </div>
          </li>
        ))}
      </ul>
    </Suspense>
  );
}
