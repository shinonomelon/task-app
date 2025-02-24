'use server';

import { revalidateTaskList, revalidateTaskSummary } from '../api/task';

import { ActionResponse, AddTask } from '@/types/task';

import { addTaskSchema } from '@/lib/schema/task';
import { createClient } from '@/lib/supabase/server';

import { MESSAGES } from '@/constants/messages';

export async function addTask(
  _: ActionResponse<AddTask> | null,
  formData: FormData
): Promise<ActionResponse<AddTask>> {
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

    const rawData: AddTask = {
      title: formData.get('title') as string,
      description:
        formData.get('description') === ''
          ? null
          : (formData.get('description') as string),
      deadline:
        formData.get('deadline') === ''
          ? null
          : (formData.get('deadline') as string),
      include_time: formData.get('include_time') === 'true',
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
      user_id: user.id
    };

    const validatedData = addTaskSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: MESSAGES.VALIDATION_FAILED,
        errors: validatedData.error.flatten().fieldErrors
      };
    }

    const { title, description, deadline, priority, user_id, include_time } =
      validatedData.data;

    const { error } = await supabase
      .from('tasks')
      .insert([
        {
          title,
          description,
          deadline,
          priority,
          include_time,
          user_id
        }
      ])
      .select();

    if (error) {
      return {
        success: false,
        message: MESSAGES.TASK.ADD.FAILED
      };
    }

    revalidateTaskList();
    revalidateTaskSummary();

    return {
      success: true,
      message: MESSAGES.TASK.ADD.SUCCESS
    };
  } catch (error) {
    console.error(`${MESSAGES.UNEXPECTED}:`, error);

    return {
      success: false,
      message: MESSAGES.UNEXPECTED
    };
  }
}
