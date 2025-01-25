'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidateTag('supabase');
  redirect('/');
}
