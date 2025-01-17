import { Suspense } from 'react';

import { TaskForm } from './task-form';
import { TaskItem } from './task-item';

import { createClient } from '@/src/lib/supabase/server';
import { Task } from '@/src/types/task';

export const TaskList = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: true });

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
    <div>
      <Suspense
        fallback={
          <div className="text-center text-gray-500 dark:text-gray-400">
            読み込み中...
          </div>
        }
      >
        <ul className="mt-4">
          {data?.map((task: Task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              text={task.text}
              created_at={task.created_at}
              completed={task.completed}
            />
          ))}
        </ul>
      </Suspense>
      <TaskForm />
    </div>
  );
};
