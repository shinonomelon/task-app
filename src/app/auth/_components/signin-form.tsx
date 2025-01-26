'use client';

import clsx from 'clsx';
import { CornerUpLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useActionState, useState } from 'react';
import { toast } from 'sonner';

import {
  ActionResponse,
  ResetPasswordFormData,
  SigninFormData
} from '@/types/auth';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { resetPassword } from '@/actions/auth/reset-password';
import { signIn } from '@/actions/auth/sign-in';

export const SignInForm = () => {
  const router = useRouter();
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [state, formAction, isPending] = useActionState<
    ActionResponse<SigninFormData>,
    FormData
  >(
    async (prevState: ActionResponse<SigninFormData>, formData: FormData) => {
      const response = await signIn(prevState, formData);

      if (!response?.success) return response;

      router.push('/app');
      toast.success(response?.message);
      return response;
    },
    {
      success: false,
      message: '',
      state: {
        email: '',
        password: ''
      }
    }
  );

  if (isForgotPassword) {
    return <SendResetPasswordEmail setIsForgotPassword={setIsForgotPassword} />;
  }

  return (
    <section className="rounded-lg bg-white px-4 py-6">
      <header>
        <h1 className="mb-4 text-center text-2xl font-bold">ログイン</h1>
      </header>
      <form action={formAction} className="mb-4 space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-bold">
            メールアドレス
          </label>
          <Input
            id="email"
            type="email"
            name="email"
            aria-describedby="email-error"
            autoFocus
            placeholder="email@example.com"
            defaultValue={state?.state?.email}
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
          </label>
          <Input
            id="password"
            type="password"
            name="password"
            defaultValue={state?.state?.password}
            aria-describedby="password-error"
            className="w-full"
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
        {state?.message && (
          <Alert variant="destructive" className="flex items-center">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          className={clsx(
            'w-full bg-green-600 font-bold transition-colors duration-150 ease-in hover:bg-green-700',
            isPending && 'cursor-not-allowed opacity-50'
          )}
        >
          {isPending && (
            <div className="flex justify-center" aria-label="読み込み中">
              <div className="size-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          )}
          ログインする
        </Button>
      </form>

      <div className="flex justify-center border-t border-gray-200 pt-4">
        <Button
          variant="ghost"
          className="transition-colors duration-150 ease-in hover:bg-gray-100"
          onClick={() => setIsForgotPassword(true)}
        >
          パスワードを忘れた場合
        </Button>
      </div>
    </section>
  );
};

const SendResetPasswordEmail = ({
  setIsForgotPassword
}: {
  setIsForgotPassword: Dispatch<SetStateAction<boolean>>;
}) => {
  const [state, formAction, isPending] = useActionState<
    ActionResponse<ResetPasswordFormData>,
    FormData
  >(
    async (prevState, formData: FormData) => {
      const response = await resetPassword(prevState, formData);
      if (!response?.success) {
        return response;
      }
      toast.success(response?.message);
      return response;
    },
    {
      success: false,
      message: '',
      state: {
        email: ''
      }
    }
  );

  return (
    <div className="space-y-4">
      <section className="rounded-lg bg-white px-4 py-6">
        <header>
          <h1 className="mb-4 text-2xl font-bold">パスワードの再設定</h1>
        </header>
        <div className="mb-4 text-base text-gray-500">
          登録済みのメールアドレスを入力してください。パスワード再設定メールを送ります。
        </div>
        <form action={formAction} className="mb-4 space-y-6">
          <Input
            id="email"
            type="email"
            name="email"
            aria-describedby="email-error"
            autoFocus
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

          <Button
            type="submit"
            className={clsx(
              'w-full bg-green-600 font-bold transition-colors duration-150 ease-in hover:bg-green-700',
              isPending && 'cursor-not-allowed opacity-50'
            )}
          >
            {isPending && (
              <div className="flex justify-center" aria-label="読み込み中">
                <div className="size-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              </div>
            )}
            再設定メールを送信する
          </Button>
        </form>
      </section>
      <div className="flex justify-center">
        <Button
          variant="ghost"
          className="transition-colors duration-150 ease-in hover:bg-gray-200"
          onClick={() => setIsForgotPassword(false)}
        >
          <CornerUpLeft className="size-6" />
          ログイン画面に戻る
        </Button>
      </div>
    </div>
  );
};
