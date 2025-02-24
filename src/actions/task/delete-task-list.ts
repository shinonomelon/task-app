'use server';

import { revalidateTaskList, revalidateTaskSummary } from '../api/task';

import { ActionResponse, DeleteTask } from '@/types/task';

import { deleteTaskListSchema } from '@/lib/schema/task';
import { createClient } from '@/lib/supabase/server';

import { MESSAGES } from '@/constants/messages';

export async function deleteTaskList(
  idList: string[]
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

    const rawData = {
      idList,
      user_id: user.id
    };

    const validatedData = deleteTaskListSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: MESSAGES.VALIDATION_FAILED,
        errors: validatedData.error.flatten().fieldErrors
      };
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .in('id', validatedData.data.idList)
      .eq('user_id', validatedData.data.user_id);

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
