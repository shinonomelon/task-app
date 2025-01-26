import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z
      .string()
      .email({ message: '有効なメールアドレスを入力してください' }),
    password: z.string().min(12, { message: 'パスワードは最低12文字必要です' }),
    confirmPassword: z
      .string()
      .min(12, { message: '確認用のパスワードを入力してください' })
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'パスワードが一致しません',
        path: ['confirmPassword']
      });
    }
  });

export const signInSchema = z.object({
  email: z
    .string()
    .email({ message: '有効なメールアドレスを入力してください' }),
  password: z.string().min(12, { message: 'パスワードは最低12文字必要です' })
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: '有効なメールアドレスを入力してください' })
});

export const updatePasswordSchema = z.object({
  password: z.string().min(12, { message: 'パスワードは最低12文字必要です' })
});
