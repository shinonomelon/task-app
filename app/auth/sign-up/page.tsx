// app/signin/page.jsx
import AuthForm from "@/components/auth-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    // <div className="min-h-screen flex items-center justify-center bg-gray-100">
    //   <div className="max-w-md w-full p-6 bg-white rounded shadow">
    //     <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
    //     <AuthForm type="signUp" />
    //     <div className="flex items-center mt-4 ">
    //       <p className="ext-center">すでにアカウントをお持ちの方はこちら</p>
    //       <Link
    //         href="/auth/sign-in"
    //         className="block text-center text-primary underline"
    //       >
    //         Sign In
    //       </Link>
    //     </div>
    //   </div>
    // </div>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            新規アカウント登録
          </h2>
        </div>
        <AuthForm type="signUp" />
        <div className="text-center">
          <Link
            href="/auth/sign-in"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            既にアカウントをお持ちの方はこちら
          </Link>
        </div>
      </div>
    </div>
  );
}
