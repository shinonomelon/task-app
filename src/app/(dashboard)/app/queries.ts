import { Task } from './types';

import { createClient } from '@/lib/supabase/server';

export type FilterBy = 'all' | 'completed' | 'today' | 'overdue';

export const fetchTasks = async (
  filterBy: FilterBy
): Promise<{ tasks: Task[] | null; error: Error | null }> => {
  const supabase = await createClient();

  let query = supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: true });

  const now = new Date();
  switch (filterBy) {
    case 'completed':
      query = query.eq('completed', true);
      break;
    case 'today':
      const startOfTodayLocal = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
      );
      const startOfTomorrowLocal = new Date(startOfTodayLocal);
      startOfTomorrowLocal.setDate(startOfTomorrowLocal.getDate() + 1);
      const startOfTodayUTC = new Date(startOfTodayLocal.toISOString());
      const startOfTomorrowUTC = new Date(startOfTomorrowLocal.toISOString());

      const startISO = startOfTodayUTC.toISOString();
      const endISO = startOfTomorrowUTC.toISOString();
      query = query
        .eq('completed', false)
        .gte('deadline', startISO)
        .lte('deadline', endISO);
      break;
    case 'overdue':
      const today = new Date(new Date().setDate(new Date().getDate() - 1))
        .toISOString()
        .split('T')[0];
      query = query.eq('completed', false).lt('deadline', today);
      break;
    case 'all':
      query = query.eq('completed', false);
      break;
    default:
      break;
  }

  const { data, error } = await query;

  return { tasks: data, error };
};
