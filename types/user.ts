import { User } from "@supabase/supabase-js";

export type AuthUser = User | null;

export interface AuthActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof User]?: string[];
  };
}
