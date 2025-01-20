'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { ActionResponse } from './types';

import { createClient } from '@/lib/supabase/server';

const addTaskSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  deadline: z.string().nullable(),
  priority: z.number().min(1).max(3, '優先度は1から3の間で選択してください')
});

type AddTaskFormData = {
  text: string;
  deadline: string | null;
  priority: number;
};

export async function addTask(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
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

    const rawData: AddTaskFormData = {
      text: formData.get('text') as string,
      deadline:
        formData.get('deadline') === ''
          ? null
          : (formData.get('deadline') as string),
      priority: parseInt(formData.get('priority') as string, 10)
    };

    const validatedData = addTaskSchema.safeParse(rawData);
    if (!validatedData.success) {
      return {
        success: false,
        message: 'フォームのエラーを修正してください',
        errors: validatedData.error.flatten().fieldErrors
      };
    }

    const { text, deadline, priority } = validatedData.data;
    const { error } = await supabase
      .from('tasks')
      .insert([
        {
          text,
          user_id: user.id,
          deadline,
          priority
        }
      ])
      .select();

    if (error) {
      return {
        success: false,
        message: 'タスクの追加に失敗しました',
        errors: {
          text: [error.message]
        }
      };
    }

    revalidatePath('/');

    return {
      success: true,
      message: 'タスクを追加しました'
    };
  } catch (error) {
    console.error('予期せぬエラーが発生しました:', error);
    return {
      success: false,
      message: '予期せぬエラーが発生しました'
    };
  }
}

export async function deleteTask(id: string): Promise<ActionResponse> {
  try {
    if (typeof id !== 'string') {
      return {
        success: false,
        message: 'タスクの削除に失敗しました',
        errors: {
          id: ['IDが必要です']
        }
      };
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      return {
        success: false,
        message: 'タスクの削除に失敗しました',
        errors: {
          id: [error.message]
        }
      };
    }
    revalidatePath('/');

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

export async function toggleTaskCompleted(
  id: string,
  completed: boolean
): Promise<ActionResponse> {
  try {
    if (typeof id !== 'string') {
      return {
        success: false,
        message: 'タスクの更新に失敗しました',
        errors: {
          id: ['IDが必要です']
        }
      };
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from('tasks')
      .update({ completed: completed })
      .eq('id', id)
      .select();

    if (error) {
      return {
        success: false,
        message: 'タスクの更新に失敗しました',
        errors: {
          id: [error.message]
        }
      };
    }
    revalidatePath('/');

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

export async function editTask(
  id: string,
  text: string
): Promise<ActionResponse> {
  try {
    if (
      typeof id !== 'string' ||
      typeof text !== 'string' ||
      text.trim() === ''
    ) {
      return {
        success: false,
        message: 'タスクの編集に失敗しました',
        errors: {
          id: ['IDが必要です'],
          text: ['テキストが必要です']
        }
      };
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from('tasks')
      .update({ text: text })
      .eq('id', id)
      .select();

    if (error) {
      return {
        success: false,
        message: 'タスクの編集に失敗しました',
        errors: {
          text: [error.message]
        }
      };
    }

    revalidatePath('/');

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

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
