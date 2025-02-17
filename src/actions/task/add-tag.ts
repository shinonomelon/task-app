'use server';

import { revalidateTaskList } from '../api/task';

import { ActionResponse, AddTag } from '@/types/task';

import { addTagSchema } from '@/lib/schema/task';
import { createClient } from '@/lib/supabase/server';

export async function addTag(
  task_id: string,
  name: string,
  color: string
): Promise<ActionResponse<AddTag>> {
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

    const rawData: AddTag = {
      name,
      color,
      user_id: user.id
    };

    const validatedData = addTagSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: 'フォームのエラーを修正してください',
        errors: validatedData.error.flatten().fieldErrors
      };
    }

    const { data, error } = await supabase
      .from('tags')
      .insert([
        {
          name: validatedData.data.name,
          color: validatedData.data.color,
          user_id: validatedData.data.user_id
        }
      ])
      .select();

    console.log(data);
    if (error) {
      return {
        success: false,
        message: 'タグの追加に失敗しました'
      };
    }

    const { error: taskError } = await supabase.from('task_tags').insert([
      {
        task_id,
        tag_id: data[0].id
      }
    ]);

    if (taskError) {
      return {
        success: false,
        message: 'タグの追加に失敗しました'
      };
    }

    revalidateTaskList();

    return {
      success: true,
      message: '1件のタグを追加しました'
    };
  } catch (error) {
    console.error('予期せぬエラーが発生しました:', error);

    return {
      success: false,
      message: '予期せぬエラーが発生しました'
    };
  }
}
