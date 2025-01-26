import { UpdatePasswordForm } from '../_components/update-password-form';

export default async function UpdatePasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        <main className="flex min-h-[calc(100vh-88px)] justify-center">
          <div className="mt-10 w-full max-w-md">
            <UpdatePasswordForm />
          </div>
        </main>
      </div>
    </div>
  );
}
