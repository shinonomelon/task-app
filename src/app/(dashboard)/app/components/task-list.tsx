import { Suspense } from 'react';

import { Task } from '../types';

import { TaskForm } from './task-form';
import { TaskItem } from './task-item';

import { createClient } from '@/lib/supabase/server';

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
    <div className="p-6 pb-24 pl-80">
      <h1 className="mb-4 text-2xl font-bold">インボックス</h1>
      <Suspense
        fallback={
          <div className="text-center text-gray-500">読み込み中...</div>
        }
      >
        <ul>
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
