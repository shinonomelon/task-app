'use server';

import { revalidateTaskList, revalidateTaskSummary } from '../api/task';

import { ActionResponse, DeleteTask } from '@/types/task';

import { deleteTaskSchema } from '@/lib/schema/task';
import { createClient } from '@/lib/supabase/server';

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
        message: '認証に失敗しました。再度ログインしてください。'
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
        message: 'タスクの削除に失敗しました',
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
        message: 'タスクの削除に失敗しました'
      };
    }

    revalidateTaskList();
    revalidateTaskSummary();

    return {
      success: true,
      message: 'タスクを削除しました'
    };
  } catch (error) {
    console.error('予期せぬエラーが発生しました:', error);

    return {
      success: false,
      message: '予期せぬエラーが発生しました'
    };
  }
}
