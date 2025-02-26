import { CornerUpLeft, LoaderCircle } from 'lucide-react';
import { Dispatch, SetStateAction, useActionState } from 'react';
import { toast } from 'sonner';

import { ActionResponse, ResetPasswordFormData } from '@/types/auth';

import { FormInput } from '@/components/form/form-input';
import { Button } from '@/components/ui/button';

import { resetPassword } from '@/actions/auth/reset-password';

export const SendResetPasswordEmail = ({
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
