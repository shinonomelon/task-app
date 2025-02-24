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

    const { error } = await supabase
      .from('tasks')
      .update({
        title: validatedData.data.title,
        description: validatedData.data.description,
        deadline: validatedData.data.deadline,
        priority: validatedData.data.priority,
        completed: validatedData.data.completed
      })
      .match({
        id: validatedData.data.id,
        user_id: validatedData.data.user_id
      });

    if (error) {
      return {
        success: false,
        message: MESSAGES.TASK.EDIT.FAILED
      };
    }
    const tagIdsStr = formData.get('tags') as string;
    const tagIds = tagIdsStr ? tagIdsStr.split(',').filter(Boolean) : [];

    const { error: deleteError } = await supabase
      .from('task_tags')
      .delete()
      .match({ task_id: validatedData.data.id });

    if (deleteError) {
      return {
        success: false,
        message: MESSAGES.TASK.EDIT.FAILED
      };
    }

    const insertData = tagIds.map((tagId: string) => ({
      task_id: validatedData.data.id,
      tag_id: tagId
    }));

    const { error: insertError } = await supabase
      .from('task_tags')
      .insert(insertData);

    if (insertError) {
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
