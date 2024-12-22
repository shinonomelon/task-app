export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
};

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof Todo]?: string[];
  };
}
