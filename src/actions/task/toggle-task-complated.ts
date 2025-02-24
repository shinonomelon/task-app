'use server';

import { revalidateTaskList, revalidateTaskSummary } from '../api/task';

import { ActionResponse, ToggleTaskCompleted } from '@/types/task';

import { toggleTaskCompletedSchema } from '@/lib/schema/task';
import { createClient } from '@/lib/supabase/server';

import { MESSAGES } from '@/constants/messages';

export async function toggleTaskCompleted(
  id: string,
  completed: boolean
): Promise<ActionResponse<ToggleTaskCompleted>> {
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

    const rawData: ToggleTaskCompleted = {
      id,
      completed,
      user_id: user.id
    };

    const validatedData = toggleTaskCompletedSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: MESSAGES.VALIDATION_FAILED,
        errors: validatedData.error.flatten().fieldErrors
      };
    }

    const { error } = await supabase
      .from('tasks')
      .update({ completed: validatedData.data.completed })
      .match({
        id: validatedData.data.id,
        user_id: validatedData.data.user_id
      });

    if (error) {
      return {
        success: false,
        message: MESSAGES.TASK.TOGGLE.FAILED
      };
    }

    revalidateTaskList();
    revalidateTaskSummary();

    return {
      success: true,
      message: completed
        ? MESSAGES.TASK.TOGGLE.SUCCESS_COMPLETE
        : MESSAGES.TASK.TOGGLE.SUCCESS_INCOMPLETE
    };
  } catch (error) {
    console.error(`${MESSAGES.UNEXPECTED}:`, error);

    return {
      success: false,
      message: MESSAGES.UNEXPECTED
    };
  }
}
