'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { toast } from 'sonner';

import { ActionResponse, SignupFormData } from '@/types/auth';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { signUp } from '@/actions/auth/sign-up';

export const SignUpForm = () => {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<
    ActionResponse<SignupFormData>,
    FormData
  >(
    async (prevState: ActionResponse<SignupFormData>, formData: FormData) => {
      const response = await signUp(prevState, formData);
      if (!response?.success) {
        toast.error(response?.message);
        return response;
      } else {
        router.push('/app');
        toast.success(response?.message);
        return response;
      }
    },
    {
      success: false,
      message: '',
      state: {
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  );

  return (
    <section className="rounded-lg bg-white px-4 py-6">
      <header>
        <h1 className="mb-4 text-center text-2xl font-bold">
          アカウントの作成
        </h1>
      </header>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-bold">
            メールアドレス
            <span
              className="ml-0.5 inline-flex -translate-y-1 text-red-400"
              title="このフィールドは必須です"
              aria-label="必須のフィールド"
            >
              *
            </span>
          </label>
          <Input
            id="email"
            type="email"
            name="email"
            aria-describedby="email-error"
            defaultValue={state?.state?.email}
            autoFocus
            required
            placeholder="email@example.com"
            className="w-full"
          />
          <p
            id="email-error"
            className="text-red-400"
            role="alert"
            aria-live="assertive"
          >
            {state?.errors?.email}
          </p>
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-bold">
            パスワード
            <span
              className="ml-0.5 inline-flex -translate-y-1 text-red-400"
              title="このフィールドは必須です"
              aria-label="必須のフィールド"
            >
              *
            </span>
          </label>
          <Input
            id="password"
            type="password"
            name="password"
            className="w-full"
            aria-describedby="password-error"
            defaultValue={state?.state?.password}
            required
            placeholder="12文字以上"
            minLength={12}
          />
          <p
            id="password-error"
            className="text-red-400"
            role="alert"
            aria-live="assertive"
          >
            {state?.errors?.password}
          </p>
        </div>
        <div className="space-y-2">
          <label htmlFor="confirm-password" className="text-sm font-bold">
            パスワードの確認
            <span
              className="ml-0.5 inline-flex -translate-y-1 text-red-400"
              title="このフィールドは必須です"
              aria-label="必須のフィールド"
            >
              *
            </span>
          </label>
          <Input
            id="confirm-password"
            type="password"
            name="confirmPassword"
            defaultValue={state?.state?.confirmPassword}
            aria-describedby="confirm-password-error"
            required
            className="w-full"
            minLength={12}
          />
          <p
            id="confirm-password-error"
            className="text-red-400"
            role="alert"
            aria-live="assertive"
          >
            {state?.errors?.confirmPassword}
          </p>
        </div>
        {state?.message && (
          <Alert variant="destructive" className="flex items-center">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          className={clsx(
            'w-full bg-green-600 font-bold hover:bg-green-700',
            isPending && 'cursor-not-allowed opacity-50'
          )}
        >
          {isPending && (
            <div className="flex justify-center" aria-label="読み込み中">
              <div className="size-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          )}
          アカウントを作成する
        </Button>
      </form>
    </section>
  );
};
