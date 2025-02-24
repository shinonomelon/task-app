import type { Database } from './database';

export type Task = Database['public']['Tables']['tasks']['Row'];

export type Tag = Database['public']['Tables']['tags']['Row'];

export type TaskTag = Database['public']['Tables']['task_tags']['Row'];

export type DisplayTag = Omit<Tag, 'user_id' | 'created_at' | 'updated_at'>;

export type DisplayTask = Omit<
  Task,
  'user_id' | 'created_at' | 'updated_at'
> & {
  tags: DisplayTag[];
};

export type AddTask = Omit<
  Task,
  'id' | 'created_at' | 'completed' | 'updated_at'
>;

export type AddTag = Omit<Tag, 'id' | 'created_at' | 'updated_at'>;

export type DeleteTask = Pick<Task, 'id' | 'user_id'>;

export type EditTask = Omit<Task, 'created_at' | 'updated_at'>;

export type ToggleTaskCompleted = Pick<Task, 'id' | 'user_id' | 'completed'>;

export type Priority = Database['public']['Enums']['priority_level'];

export type FilterBy = 'all' | 'completed' | 'today' | 'overdue';

export type TaskCount = {
  total_task: number;
  completed_task: number;
};

export type LatestTaskList = Pick<Task, 'id' | 'title' | 'completed'>[] | null;

export type TaskSummary = {
  overall: TaskCount;
  today: TaskCount & {
    latest_task_list: LatestTaskList;
  };
};

export type OverAllSummary = TaskCount;

export type TodayTaskSummary = TaskCount & {
  latest_task_list: LatestTaskList;
};

export type ActionResponse<T> = {
  success: boolean;
  message: string;
  state?: T;
  errors?: {
    [K in keyof T]?: string[];
  };
};
