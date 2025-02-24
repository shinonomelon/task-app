'use server';

import { revalidateTaskList, revalidateTaskSummary } from '../api/task';

import { ActionResponse, DeleteTask } from '@/types/task';

import { deleteTaskSchema } from '@/lib/schema/task';
import { createClient } from '@/lib/supabase/server';

import { MESSAGES } from '@/constants/messages';

export async function deleteTask(
  id: string
): Promise<ActionResponse<DeleteTask>> {
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

    const rawData: DeleteTask = {
      id: id,
      user_id: user.id
    };

    const validatedData = deleteTaskSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: MESSAGES.VALIDATION_FAILED,
        errors: validatedData.error.flatten().fieldErrors
      };
    }

    const { error } = await supabase.from('tasks').delete().match({
      id: validatedData.data.id,
      user_id: validatedData.data.user_id
    });

    if (error) {
      return {
        success: false,
        message: MESSAGES.TASK.DELETE.FAILED
      };
    }

    revalidateTaskList();
    revalidateTaskSummary();

    return {
      success: true,
      message: MESSAGES.TASK.DELETE.SUCCESS
    };
  } catch (error) {
    console.error(`${MESSAGES.UNEXPECTED}:`, error);

    return {
      success: false,
      message: MESSAGES.UNEXPECTED
    };
  }
}
