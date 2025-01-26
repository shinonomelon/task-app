'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { toast } from 'sonner';

import { ActionResponse, UpdatePasswordFormData } from '@/types/auth';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { updatePassword } from '@/actions/auth/update-password';

export const UpdatePasswordForm = () => {
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
    <div>
      <form action={formAction} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-bold">
            新しいパスワード
          </label>
          <Input
            id="password"
            type="password"
            name="password"
            className="w-full"
            defaultValue={state?.state?.password}
            autoFocus
            required
            placeholder="新しいパスワードを入力してください"
            aria-describedby="password-error"
          />
          <p
            id="password-error"
            className="text-red-400"
            role="alert"
            aria-live="assertive"
          >
            {state?.errors?.password}
          </p>
          <Button type="submit" disabled={isPending}>
            パスワードを更新
          </Button>
          {state?.message && (
            <Alert variant="destructive" className="flex items-center">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </div>
      </form>
      <Link
        href={{
          pathname: '/auth',
          query: { type: 'signin' }
        }}
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        ログイン画面に戻る
      </Link>
    </div>
  );
};
