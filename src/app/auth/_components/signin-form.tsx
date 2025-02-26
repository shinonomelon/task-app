'use client';

import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, useState } from 'react';
import { toast } from 'sonner';

import { SendResetPasswordEmail } from './send-reset-password-email';

import { ActionResponse, SigninFormData } from '@/types/auth';

import { FormField } from '@/components/form/form-field';
import { FormInput } from '@/components/form/form-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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
