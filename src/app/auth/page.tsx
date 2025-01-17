import { Header } from './components/header';
import { SignInForm } from './components/signin-form';
import { SignUpForm } from './components/signup-form';

export type SearchParams = {
  type?: 'signin' | 'signup';
};

export default async function AuthPage(props: {
  searchParams?: Promise<SearchParams>;
}) {
  const searchParams = (await props.searchParams) || { type: 'signin' };
  const type = searchParams.type || 'signin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        <Header type={type} />

        <main className="flex min-h-[calc(100vh-88px)] justify-center">
          <div className="mt-10 w-full max-w-md">
            {type === 'signin' ? <SignInForm /> : <SignUpForm />}
          </div>
        </main>
      </div>
    </div>
  );
}
