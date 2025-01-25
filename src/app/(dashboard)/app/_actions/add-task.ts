'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import { ActionResponse, AddTask } from '../types';

import { createClient } from '@/lib/supabase/server';

const addTaskSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  deadline: z.string().nullable(),
  priority: z.enum(['low', 'medium', 'high']),
  user_id: z.string().min(1, 'ユーザーIDが必要です')
});

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
        message: '認証に失敗しました。再度ログインしてください。'
      };
    }

    const rawData: AddTask = {
      text: formData.get('text') as string,
      deadline:
        formData.get('deadline') === ''
          ? null
          : (formData.get('deadline') as string),
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
      user_id: user.id
    };

    const validatedData = addTaskSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: 'フォームのエラーを修正してください',
        errors: validatedData.error.flatten().fieldErrors
      };
    }

    const { text, deadline, priority, user_id } = validatedData.data;

    const { error } = await supabase
      .from('tasks')
      .insert([
        {
          text,
          user_id,
          deadline,
          priority
        }
      ])
      .select();

    if (error) {
      return {
        success: false,
        message: 'タスクの追加に失敗しました'
      };
    }

    revalidateTag('supabase');

    return {
      success: true,
      message: '1件のタスクを追加しました'
    };
  } catch (error) {
    console.error('予期せぬエラーが発生しました:', error);

    return {
      success: false,
      message: '予期せぬエラーが発生しました'
    };
  }
}
