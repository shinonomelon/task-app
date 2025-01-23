export type Task = {
  id: string;
  text: string;
  user_id: string;
  completed: boolean;
  created_at: string;
  deadline: string | null;
  priority: Priority;
};

export type Priority = 'low' | 'medium' | 'high';

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

export interface ActionResponse<T> {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof T]?: string[];
  };
}
