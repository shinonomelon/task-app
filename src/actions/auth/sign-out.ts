'use server';

import { createClient } from '@/lib/supabase/server';

import { MESSAGES } from '@/constants/messages';

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, message: MESSAGES.AUTH.SIGNOUT.FAILED };
  }

  return { success: true, message: MESSAGES.AUTH.SIGNOUT.SUCCESS };
}
