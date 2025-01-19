import { Suspense } from 'react';

import { Task } from '../types';

import { TaskForm } from './task-form';
import { TaskItem } from './task-item';
import { TaskSection } from './task-selection';

import { createClient } from '@/lib/supabase/server';

export const TaskList = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return (
      <div className="rounded-lg bg-red-100 p-4 text-red-500" role="alert">
        エラーが発生しました: {error.message}
      </div>
    );
  }

  const completedTasks: Task[] = data?.filter((task) => task.completed);
  const pendingTasks: Task[] = data?.filter((task) => !task.completed);

  return (
    <div className="p-6 pb-24 pl-80">
      <h1 className="mb-4 text-2xl font-bold">インボックス</h1>
      <Suspense
        fallback={
          <div className="text-center text-gray-500">読み込み中...</div>
        }
      >
        <ul>
          {pendingTasks?.map((task: Task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              user_id={task.user_id}
              text={task.text}
              created_at={task.created_at}
              completed={task.completed}
              deadline={task.deadline}
              priority={task.priority}
            />
          ))}
        </ul>
      </Suspense>
      <TaskForm />
      <TaskSection title="完了" count={completedTasks?.length}>
        <Suspense
          fallback={
            <div className="text-center text-gray-500">読み込み中...</div>
          }
        >
          <ul>
            {completedTasks?.map((task: Task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                user_id={task.user_id}
                text={task.text}
                created_at={task.created_at}
                completed={task.completed}
                deadline={task.deadline}
                priority={task.priority}
              />
            ))}
          </ul>
        </Suspense>
      </TaskSection>
    </div>
  );
};
