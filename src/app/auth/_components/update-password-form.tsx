'use client';

import { LoaderCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { toast } from 'sonner';

import { ActionResponse, UpdatePasswordFormData } from '@/types/auth';

import { FormField } from '@/components/form/form-field';
import { FormInput } from '@/components/form/form-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import { updatePassword } from '@/actions/auth/update-password';

export const UpdatePasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [state, formAction, isPending] = useActionState<
    ActionResponse<UpdatePasswordFormData>,
    FormData
  >(
    async (
      prevState: ActionResponse<UpdatePasswordFormData>,
      formData: FormData
    ) => {
      const response = await updatePassword(prevState, formData);

      if (!response?.success) return response;

      router.push('/auth?type=signin');
      toast.success(response?.message);
      return response;
    },
    {
      success: false,
      message: '',
      state: {
        password: ''
      }
    }
  );

  return (
    <section className="rounded-lg bg-white px-4 py-6">
      <input type="hidden" name="url" value={window.location.href} />
      <header className="mb-4">
        <h1 className="mb-4 text-2xl font-bold">パスワード更新</h1>
        <div className="text-base text-gray-500">
          再設定するパスワードを入力してください。
        </div>
      </header>
      <form action={formAction} className="space-y-4">
        <p className="text-base font-semibold">メールアドレス: {email}</p>

        <FormField
          label="新しいパスワード"
          name="password"
          required
          error={state?.errors?.password}
        >
          <FormInput
            id="password"
            name="password"
            type="password"
            required
            placeholder="新しいパスワードを入力してください"
            defaultValue={state?.state?.password}
            autoFocus
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
              <span>更新中</span>
            </>
          ) : (
            <span>パスワードを更新</span>
          )}
        </Button>
      </form>
    </section>
  );
};
