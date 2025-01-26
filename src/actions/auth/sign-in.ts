'use server';

import { revalidatePath } from 'next/cache';

import { ActionResponse, SigninFormData } from '@/types/auth';

import { signInSchema } from '@/lib/schema/auth';
import { createClient } from '@/lib/supabase/server';

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
      message: 'フォームのエラーを修正してください',
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
      message: 'ログインに失敗しました'
    };
  }

  revalidatePath('/app', 'layout');

  return {
    success: true,
    state: rawData,
    message: 'ログインしました'
  };
}
