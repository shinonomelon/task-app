import { Metadata } from 'next';

import { Header } from './_components/header';
import { SignInForm } from './_components/signin-form';
import { SignUpForm } from './_components/signup-form';

export type SearchParams = {
  type?: 'signin' | 'signup';
};

export async function generateMetadata({
  searchParams
}: {
  searchParams?: Promise<SearchParams>;
}): Promise<Metadata> {
  const type = (await searchParams)?.type;
  return {
    title: type === 'signup' ? 'アカウント作成' : 'ログイン'
  };
}

export default async function AuthPage(props: {
  searchParams?: Promise<SearchParams>;
}) {
  const searchParams = (await props.searchParams) || { type: 'signin' };
  const type = searchParams.type || 'signin';

  return (
    <>
      <Header type={type} />

      <main className="flex min-h-[calc(100vh-88px)] justify-center">
        <div className="mt-10 w-full max-w-md">
          {type === 'signin' ? <SignInForm /> : <SignUpForm />}
        </div>
      </main>
    </>
  );
}
