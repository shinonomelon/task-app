export type Task = {
  id: string;
  text: string;
  user_id: string;
  completed: boolean;
  created_at: string;
  deadline?: string;
  priority: 1 | 2 | 3;
};

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof Task]?: string[];
  };
}
