import { revalidateTag } from 'next/cache';
import 'server-only';

import { TaskSummaryDetail } from '@/types/task';

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

// タスクの要約を取得
const taskSummaryTag = 'task-summary';

export const getTaskSummary = async () => {
  const supabase = await createClient({ tags: [taskSummaryTag] });
  const { data, error } = await supabase.rpc('get_task_summary');

  if (error) throw error;

  return { data: data as TaskSummaryDetail };
};

export const revalidateTaskSummary = () => revalidateTag(taskSummaryTag);
export const preloadTaskSummary = () => void getTaskSummary();
