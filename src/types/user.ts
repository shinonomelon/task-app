export type AuthFormData = {
  email: string;
  password: string;
};

export interface AuthActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof AuthFormData]?: string[];
  };
}
