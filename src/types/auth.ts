export type SignupFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type SigninFormData = Omit<SignupFormData, 'confirmPassword'>;

export type ActionResponse<T> =
  | {
      state: T;
      message: string;
      errors?: {
        [K in keyof T]?: string[];
      };
    }
  | undefined;
