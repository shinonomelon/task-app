'use server';

import { revalidateTag } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, message: 'ログアウトに失敗しました' };
  }

  revalidateTag('supabase');

  return { success: true, message: 'ログアウトしました' };
}
