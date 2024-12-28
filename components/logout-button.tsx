"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("ログアウトに失敗しました:", error.message);
    } else {
      router.push("/auth/sign-in");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700"
    >
      ログアウト
    </button>
  );
}
