export type SignupFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type SigninFormData = Omit<SignupFormData, 'confirmPassword'>;

export type ResetPasswordFormData = {
  email: string;
};

export type UpdatePasswordFormData = {
  password: string;
};

export type ActionResponse<T> = {
  success: boolean;
  state: T;
  message: string;
  errors?: {
    [K in keyof T]?: string[];
  };
};
