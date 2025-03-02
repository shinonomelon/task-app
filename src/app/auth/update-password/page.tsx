import { UpdatePasswordForm } from '../../../components/auth/update-password-form';

export default async function UpdatePasswordPage() {
  return (
    <main className="flex min-h-[calc(100vh-88px)] justify-center">
      <div className="mt-10 w-full max-w-md">
        <UpdatePasswordForm />
      </div>
    </main>
  );
}
