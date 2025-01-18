'use client';

import clsx from 'clsx';
import { useActionState } from 'react';

import { signin } from '../actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const SignInForm = () => {
  const [state, formAction, isPending] = useActionState(signin, undefined);
  return (
    <section className="rounded-lg bg-white px-4 py-6">
      <header>
        <h1 className="mb-4 text-center text-2xl font-bold">ログイン</h1>
      </header>
      <form action={formAction} className="space-y-6">
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
          ログインする
        </Button>
      </form>
    </section>
  );
};
