'use server';

import { revalidateTaskList, revalidateTaskSummary } from '../api/task';

import { ActionResponse, EditTask } from '@/types/task';

import { editTaskSchema } from '@/lib/schema/task';
import { createClient } from '@/lib/supabase/server';

import { MESSAGES } from '@/constants/messages';

export async function editTask(
  _: ActionResponse<EditTask> | null,
  formData: FormData
): Promise<ActionResponse<EditTask>> {
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

    const rawData: EditTask = {
      id: formData.get('id') as string,
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
      completed: formData.get('completed') === 'true',
      user_id: user.id
    };

    const validatedData = editTaskSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: MESSAGES.VALIDATION_FAILED,
        errors: validatedData.error.flatten().fieldErrors
      };
    }

    const tagIdsStr = formData.get('tags') as string;
    const tagIds = tagIdsStr ? tagIdsStr.split(',').filter(Boolean) : [];

    const { error } = await supabase.rpc('edit_task', {
      p_task_id: validatedData.data.id,
      p_user_id: validatedData.data.user_id,
      p_title: validatedData.data.title,
      p_description: validatedData.data.description ?? '',
      p_deadline: validatedData.data.deadline ?? '',
      p_include_time: validatedData.data.include_time,
      p_priority: validatedData.data.priority,
      p_completed: validatedData.data.completed,
      p_tag_ids: tagIds
    });

    if (error) {
      return {
        success: false,
        message: MESSAGES.TASK.EDIT.FAILED
      };
    }

    revalidateTaskList();
    revalidateTaskSummary();

    return {
      success: true,
      message: MESSAGES.TASK.EDIT.SUCCESS
    };
  } catch (error) {
    console.error(`${MESSAGES.UNEXPECTED}:`, error);

    return {
      success: false,
      message: MESSAGES.UNEXPECTED
    };
  }
}
