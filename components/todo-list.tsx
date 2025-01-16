import { Suspense } from 'react';

import { TodoItem } from './todo-item';

import { Todo } from '@/types/todo';

import { createClient } from '@/lib/supabase/server';

export async function TodoList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div
        className="rounded-lg bg-red-100 p-4 text-red-500 dark:bg-red-900"
        role="alert"
      >
        エラーが発生しました: {error.message}
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="text-center text-gray-500 dark:text-gray-400">
          読み込み中...
        </div>
      }
    >
      <ul className="mt-8 space-y-3" role="list">
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
