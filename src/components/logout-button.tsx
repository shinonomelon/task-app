'use client';

import { useRouter } from 'next/navigation';

import { createClient } from '@/src/lib/supabase/client';

export const LogoutButton = () => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) router.push('/auth/sign-in');
  };

  return (
    <button
      onClick={handleLogout}
      className="border-red-500 text-red-500 hover:border-red-700 hover:text-red-700"
    >
      ログアウト
    </button>
  );
};
