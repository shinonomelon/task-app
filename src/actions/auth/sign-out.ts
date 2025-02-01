'use server';

import { createClient } from '@/lib/supabase/server';

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, message: 'ログアウトに失敗しました' };
  }

  return { success: true, message: 'ログアウトしました' };
}
