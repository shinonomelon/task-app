'use server';

import { ActionResponse, SignupFormData } from '@/types/auth';

import { signUpSchema } from '@/lib/schema/auth';
import { createClient } from '@/lib/supabase/server';

import { MESSAGES } from '@/constants/messages';

export async function signUp(
  _: ActionResponse<SignupFormData>,
  formData: FormData
): Promise<ActionResponse<SignupFormData>> {
  const rawData: SignupFormData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string
  };

  const validatedData = signUpSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      state: rawData,
      message: MESSAGES.VALIDATION_FAILED,
      errors: validatedData.error.flatten().fieldErrors
    };
  }

  const { email, password } = validatedData.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error?.code === 'user_already_exists') {
    return {
      success: false,
      state: rawData,
      message: MESSAGES.AUTH.SIGNUP.USER_ALLREADY_EXISTS
    };
  }

  if (error) {
    return {
      success: false,
      state: rawData,
      message: MESSAGES.AUTH.SIGNUP.FAILED
    };
  }

  return {
    success: true,
    state: rawData,
    message: MESSAGES.AUTH.SIGNUP.SUCCESS
  };
}
