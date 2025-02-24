'use client';

import { CornerUpLeft, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useActionState, useState } from 'react';
import { toast } from 'sonner';

import {
  ActionResponse,
  ResetPasswordFormData,
  SigninFormData
} from '@/types/auth';

import { FormField } from '@/components/form/form-field';
import { FormInput } from '@/components/form/form-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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
      <form action={formAction} className="space-y-4">
        <FormField
          label="メールアドレス"
          name="email"
          required
          error={state?.errors?.email}
        >
          <FormInput
            id="email"
            name="email"
            type="email"
            placeholder="email@example.com"
            defaultValue={state?.state?.email}
            required
            autoFocus
          />
        </FormField>

        <FormField
          label="パスワード"
          name="password"
          required
          error={state?.errors?.password}
        >
          <FormInput
            id="password"
            name="password"
            type="password"
            required
            defaultValue={state?.state?.password}
          />
        </FormField>

        {state?.message && (
          <Alert variant="destructive">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full gap-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin" />
              <span>ログイン中</span>
            </>
          ) : (
            <span>ログインする</span>
          )}
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
        <form action={formAction} className="mb-4 space-y-4">
          <FormInput
            id="email"
            name="email"
            type="email"
            required
            placeholder="email@example.com"
            defaultValue={state?.state?.email}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <LoaderCircle className="animate-spin" />
                <span>再設定メールを送信中</span>
              </>
            ) : (
              <>再設定メールを送信する</>
            )}
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
