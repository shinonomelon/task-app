'use server';

import { ActionResponse, UpdatePasswordFormData } from '@/types/auth';

import { updatePasswordSchema } from '@/lib/schema/auth';
import { createClient } from '@/lib/supabase/server';

import { MESSAGES } from '@/constants/messages';

export async function updatePassword(
  _: ActionResponse<UpdatePasswordFormData>,
  formData: FormData
): Promise<ActionResponse<UpdatePasswordFormData>> {
  const searchParams = new URL(formData.get('url') as string).searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return {
      success: false,
      state: {
        password: ''
      },
      message: MESSAGES.AUTH.INVALID_TOKEN
    };
  }

  const rawData: UpdatePasswordFormData = {
    password: formData.get('password') as string
  };

  const validatedData = updatePasswordSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      state: rawData,
      message: MESSAGES.VALIDATION_FAILED,
      errors: validatedData.error.flatten().fieldErrors
    };
  }

  const { password } = validatedData.data;

  const supabase = await createClient();

  const { error: tokenError } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: 'email'
  });

  if (tokenError) {
    return {
      success: false,
      state: rawData,
      message: MESSAGES.AUTH.VERIFY_OTP.FAILED
    };
  }

  const { error } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    return {
      success: false,
      state: rawData,
      message: MESSAGES.AUTH.UPDATE_PASSWORD.FAILED
    };
  }

  return {
    success: true,
    state: rawData,
    message: MESSAGES.AUTH.UPDATE_PASSWORD.SUCCESS
  };
}
