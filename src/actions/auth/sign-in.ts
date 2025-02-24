'use server';

import { ActionResponse, SigninFormData } from '@/types/auth';

import { signInSchema } from '@/lib/schema/auth';
import { createClient } from '@/lib/supabase/server';

import { MESSAGES } from '@/constants/messages';

export async function signIn(
  _: ActionResponse<SigninFormData>,
  formData: FormData
): Promise<ActionResponse<SigninFormData>> {
  const rawData: SigninFormData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  };

  const validatedData = signInSchema.safeParse(rawData);

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

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return {
      success: false,
      state: rawData,
      message: MESSAGES.AUTH.SIGNIN.FAILED
    };
  }

  return {
    success: true,
    state: rawData,
    message: MESSAGES.AUTH.SIGNIN.SUCCESS
  };
}
