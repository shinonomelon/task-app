import { Database } from './database';

export type Task = Database['public']['Tables']['tasks']['Row'];

export type DisplayTask = Omit<Task, 'user_id' | 'created_at'>;

export type AddTask = Omit<Task, 'id' | 'created_at' | 'completed'>;

export type DeleteTask = Omit<
  Task,
  'text' | 'created_at' | 'completed' | 'deadline' | 'priority'
>;

export type EditTask = Omit<Task, 'created_at'>;

export type ToggleTaskCompleted = Omit<
  Task,
  'text' | 'created_at' | 'deadline' | 'priority'
>;

export type Priority = Database['public']['Enums']['priority_level'];

export type FilterBy = 'all' | 'completed' | 'today' | 'overdue';

export type TaskSummary = {
  overall: TaskCount;
  today: TaskCount & {
    latest_task_list:
      | Omit<Task, 'user_id' | 'created_at' | 'deadline' | 'priority'>[]
      | null;
  };
};

export type TaskCount = {
  total_task: number;
  completed_task: number;
};

export type OverAllSummary = TaskCount;

export type TodayTaskSummary = TaskCount & {
  latest_task_list:
    | Omit<Task, 'user_id' | 'created_at' | 'deadline' | 'priority'>[]
    | null;
};

export type ActionResponse<T> = {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof T]?: string[];
  };
};
