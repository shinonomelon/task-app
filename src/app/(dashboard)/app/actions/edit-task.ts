'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import { ActionResponse, EditTask } from '../types';

import { createClient } from '@/lib/supabase/server';

const editTaskSchema = z.object({
  id: z.string().uuid('IDはUUIDでなければなりません'),
  text: z.string().min(1, 'テキストは必須です'),
  deadline: z.string().nullable(),
  priority: z.enum(['low', 'medium', 'high']),
  completed: z.boolean(),
  user_id: z.string().uuid('ユーザーIDはUUIDでなければなりません')
});

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
        message: '認証に失敗しました。再度ログインしてください。'
      };
    }

    const rawData: EditTask = {
      id: formData.get('id') as string,
      text: formData.get('text') as string,
      deadline:
        formData.get('deadline') === ''
          ? null
          : (formData.get('deadline') as string),
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
      completed: formData.get('completed') === 'true',
      user_id: user.id
    };

    const validatedData = editTaskSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: 'タスクの削除に失敗しました',
        errors: validatedData.error.flatten().fieldErrors
      };
    }

    const { error } = await supabase
      .from('tasks')
      .update({
        text: validatedData.data.text,
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
        message: 'タスクの編集に失敗しました'
      };
    }

    revalidateTag('supabase');

    return {
      success: true,
      message: 'タスクを編集しました'
    };
  } catch (error) {
    console.error('予期せぬエラーが発生しました:', error);

    return {
      success: false,
      message: '予期せぬエラーが発生しました'
    };
  }
}
