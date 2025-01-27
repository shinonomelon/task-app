'use server';

import { ActionResponse, ResetPasswordFormData } from '@/types/auth';

import { resetPasswordSchema } from '@/lib/schema/auth';
import { createClient } from '@/lib/supabase/server';

export async function resetPassword(
  _: ActionResponse<ResetPasswordFormData>,
  formData: FormData
): Promise<ActionResponse<ResetPasswordFormData>> {
  const rawData: ResetPasswordFormData = {
    email: formData.get('email') as string
  };

  const validatedData = resetPasswordSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      state: rawData,
      message: 'フォームのエラーを修正してください',
      errors: validatedData.error.flatten().fieldErrors
    };
  }

  const { email } = validatedData.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/update-password`
  });

  if (error) {
    return {
      success: false,
      message: 'パスワードリセットメールの送信に失敗しました',
      state: rawData
    };
  }

  return {
    success: true,
    message: 'パスワードリセットメールを送信しました',
    state: rawData
  };
}
