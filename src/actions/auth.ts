'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { createClient } from '@/src/lib/supabase/server';
import { AuthActionResponse, AuthFormData } from '@/src/types/user';

const authUserSchema = z.object({
  email: z
    .string()
    .email({ message: '有効なメールアドレスを入力してください。' }),
  password: z.string().min(6, { message: 'パスワードは最低6文字必要です。' })
});

export async function signin(
  prevState: AuthActionResponse | null,
  formData: FormData
): Promise<AuthActionResponse> {
  const rawData: AuthFormData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  };

  // Validate the form data
  const validatedData = authUserSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form',
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
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(
  prevState: AuthActionResponse | null,
  formData: FormData
): Promise<AuthActionResponse> {
  const rawData: AuthFormData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  };

  // Validate the form data
  const validatedData = authUserSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form',
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
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
