'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { toast } from 'sonner';

import { ActionResponse, UpdatePasswordFormData } from '@/types/auth';

import { cn } from '@/lib/utils/cn';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="url" value={window.location.href} />
      <div className="">
        <header className="mb-4 space-y-2">
          <h1 className="text-2xl font-bold">パスワード更新</h1>
          <div className="text-base text-gray-500">
            再設定するパスワードを入力してください。
          </div>
        </header>
        <div className="space-y-4">
          <p className="text-base font-semibold">メールアドレス: {email}</p>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-bold">
              新しいパスワード
              <span
                className="ml-0.5 inline-flex -translate-y-1 text-red-400"
                title="このフィールドは必須です"
                aria-label="必須のフィールド"
              >
                *
              </span>
            </Label>
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
          </div>

          <Button
            type="submit"
            className={cn(
              'w-full bg-green-600 font-bold transition-colors duration-150 ease-in hover:bg-green-700',
              isPending && 'cursor-not-allowed opacity-50'
            )}
          >
            {isPending && (
              <div className="flex justify-center" aria-label="読み込み中">
                <div className="size-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              </div>
            )}
            パスワードを更新
          </Button>
          {state?.message && (
            <Alert variant="destructive" className="flex items-center">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </form>
  );
};
