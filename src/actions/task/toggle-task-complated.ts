'use server';

import { revalidateTag } from 'next/cache';

import { ActionResponse, ToggleTaskCompleted } from '@/types/task';

import { toggleTaskCompletedSchema } from '@/lib/schema/task';
import { createClient } from '@/lib/supabase/server';

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
        message: '認証に失敗しました。再度ログインしてください。'
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
        message: 'タスクの削除に失敗しました',
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
        message: 'タスクの更新に失敗しました'
      };
    }

    revalidateTag('supabase');

    return {
      success: true,
      message: 'タスクを更新しました'
    };
  } catch (error) {
    console.error('予期せぬエラーが発生しました:', error);

    return {
      success: false,
      message: '予期せぬエラーが発生しました'
    };
  }
}
