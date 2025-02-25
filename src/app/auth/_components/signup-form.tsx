'use client';

import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { toast } from 'sonner';

import { ActionResponse, SignupFormData } from '@/types/auth';

import { FormField } from '@/components/form/form-field';
import { FormInput } from '@/components/form/form-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import { signUp } from '@/actions/auth/sign-up';
import { MESSAGES } from '@/constants/messages';

export const SignUpForm = () => {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<
    ActionResponse<SignupFormData>,
    FormData
  >(
    async (prevState: ActionResponse<SignupFormData>, formData: FormData) => {
      const response = await signUp(prevState, formData);

      if (!response?.success) {
        if (response?.message === MESSAGES.AUTH.SIGNUP.USER_ALLREADY_EXISTS) {
          router.push('/auth?type=signin');
          toast.error(response?.message, {
            style: {
              background: 'red',
              color: 'white'
            }
          });
        }
        return response;
      }

      router.push('/app');
      toast.success(response?.message);
      return response;
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
          description="12文字以上で入力してください"
        >
          <FormInput
            id="password"
            name="password"
            type="password"
            minLength={12}
            required
            defaultValue={state?.state?.password}
          />
        </FormField>

        <FormField
          label="パスワードの確認"
          name="confirmPassword"
          required
          error={state?.errors?.confirmPassword}
        >
          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            minLength={12}
            required
            defaultValue={state?.state?.confirmPassword}
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
              <span>アカウントを作成中</span>
            </>
          ) : (
            <span>アカウントを作成する</span>
          )}
        </Button>
      </form>
    </section>
  );
};
