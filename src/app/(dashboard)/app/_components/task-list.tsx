import { FilterBy } from '../types';

import { TaskSection } from './task-selection';

import { createClient } from '@/lib/supabase/server';

export const TaskList = async ({
  filterByList
}: {
  filterByList: FilterBy[];
}) => {
  const supabase = await createClient();
  const { data: tasks, error } = await supabase
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

  if (!tasks || tasks.length === 0) {
    return null;
  }

  return <TaskSection tasks={tasks} filterByList={filterByList} />;
};
