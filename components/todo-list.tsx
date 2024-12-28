import { createClient } from "@/lib/supabase/server";
import { Todo } from "@/types/todo";
import { Suspense } from "react";
import { TodoItem } from "./todo-item";

export async function TodoList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

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
      <ul className="space-y-3 mt-8" role="list">
        {data?.map((todo: Todo) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            text={todo.text}
            created_at={todo.created_at}
            completed={todo.completed}
          />
        ))}
      </ul>
    </Suspense>
  );
}
