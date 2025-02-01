import { revalidateTag } from 'next/cache';
import 'server-only';

import { createClient } from '@/lib/supabase/server';

// タスク一覧を取得
const taskListTag = 'task-list';

export const getTaskList = async () => {
  const supabase = await createClient({ tags: [taskListTag] });
  const { data, error } = await supabase
    .from('tasks')
    .select('id, text, completed, deadline, priority')
    .order('created_at', { ascending: true });

  if (error) throw error;

  return { data };
};

export const revalidateTaskList = () => revalidateTag(taskListTag);
export const preloadTaskList = () => void getTaskList();

// タスク数を取得
const taskCountsTag = 'task-counts';

export const getTaskCounts = async () => {
  const supabase = await createClient({ tags: [taskCountsTag] });
  const { data, error } = await supabase.rpc('get_task_counts');

  if (error) throw error;

  return { data };
};
export const revalidateTaskCounts = () => revalidateTag(taskCountsTag);
export const preloadTaskCounts = () => void getTaskCounts();
