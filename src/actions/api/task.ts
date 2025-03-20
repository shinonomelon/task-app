import { revalidateTag } from 'next/cache';
import 'server-only';

import { TaskSummary } from '@/types/task';

import { createClient } from '@/lib/supabase/server';

// タスク一覧を取得
const taskListTag = 'task-list';

export const getTaskList = async () => {
  const supabase = await createClient({
    revalidate: 60,
    tags: [taskListTag]
  });
  const { data: taskList, error } = await supabase
    .from('tasks')
    .select(
      'id, title, description, completed, deadline, priority, include_time, tags(id, name)'
    )
    .order('created_at', { ascending: true });

  if (error) throw error;

  return taskList;
};

export const revalidateTaskList = () => revalidateTag(taskListTag);
export const preloadTaskList = () => void getTaskList();

// タスクの要約を取得
const taskSummaryTag = 'task-summary';

export const getTaskSummary = async () => {
  const supabase = await createClient({
    revalidate: 60,
    tags: [taskSummaryTag]
  });
  const { data, error } = await supabase.rpc('get_task_summary');

  if (error) throw error;

  return { data: data as TaskSummary };
};

export const revalidateTaskSummary = () => revalidateTag(taskSummaryTag);
export const preloadTaskSummary = () => void getTaskSummary();
