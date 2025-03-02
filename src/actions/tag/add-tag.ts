'use server';

import { ActionResponse, AddTag, DisplayTag } from '@/types/task';

import { addTagSchema } from '@/lib/schema/task';
import { createClient } from '@/lib/supabase/server';

import { MESSAGES } from '@/constants/messages';

export async function addTag(
  name: string
): Promise<ActionResponse<DisplayTag>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        message: MESSAGES.AUTH.UNAUTHORIZED
      };
    }

    const rawData: AddTag = {
      name,
      user_id: user.id
    };

    const validatedData = addTagSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: MESSAGES.VALIDATION_FAILED,
        errors: validatedData.error.flatten().fieldErrors
      };
    }

    const { data, error } = await supabase
      .from('tags')
      .insert([
        {
          name: validatedData.data.name,
          user_id: validatedData.data.user_id
        }
      ])
      .select('id, name');

    if (error) {
      return {
        success: false,
        message: MESSAGES.TAG.ADD.FAILED
      };
    }

    return {
      success: true,
      message: MESSAGES.TAG.ADD.SUCCESS,
      state: data[0]
    };
  } catch (error) {
    console.error(`${MESSAGES.UNEXPECTED}:`, error);

    return {
      success: false,
      message: MESSAGES.UNEXPECTED
    };
  }
}
