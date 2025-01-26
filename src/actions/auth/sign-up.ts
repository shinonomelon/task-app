'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { ActionResponse, SignupFormData } from '@/types/auth';

import { signUpSchema } from '@/lib/schema/auth';
import { createClient } from '@/lib/supabase/server';

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
      state: rawData,
      message: 'フォームのエラーを修正してください',
      errors: validatedData.error.flatten().fieldErrors
    };
  }

  const { email, password } = validatedData.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    return {
      state: rawData,
      message: error.message
    };
  }

  revalidatePath('/app', 'layout');
  redirect('/app');
}
