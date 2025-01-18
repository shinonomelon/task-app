import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { createClient } from '@/lib/supabase/server';

export const authUserSchema = z.object({
  email: z
    .string()
    .email({ message: '有効なメールアドレスを入力してください。' }),
  password: z.string().min(6, { message: 'パスワードは最低6文字必要です。' })
});

export async function handleAuth(
  formData: FormData,
  authType: 'signIn' | 'signUp'
) {
  // バリデーション
  const parsedData = authUserSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  });

  if (!parsedData.success) {
    const errorMessage = encodeURIComponent(
      parsedData.error.errors.map((err) => err.message).join(', ')
    );
    redirect(`/error?message=${errorMessage}`);
  }

  const { email, password } = parsedData.data;

  const supabase = await createClient();

  let response;
  if (authType === 'signIn') {
    response = await supabase.auth.signInWithPassword({ email, password });
  } else {
    response = await supabase.auth.signUp({ email, password });
  }

  const { error } = response;

  if (error) {
    if (authType === 'signIn' && error.message === 'ユーザーが見つかりません') {
      // エラーメッセージは実際のSupabaseのメッセージに合わせてください
      // ユーザーが存在しない場合、サインアップページにリダイレクト
      redirect(`/signup?email=${encodeURIComponent(email)}`);
    } else {
      // その他のエラーの場合、エラーページにリダイレクト
      const errorMessage = encodeURIComponent(error.message);
      redirect(`/error?message=${errorMessage}`);
    }
  }

  // キャッシュの再検証
  revalidatePath('/');

  // ホームページにリダイレクト
  redirect('/');
}
