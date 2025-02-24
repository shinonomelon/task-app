'use server';

import { ActionResponse, AddTag, DisplayTag } from '@/types/task';

import { addTagSchema } from '@/lib/schema/task';
import { createClient } from '@/lib/supabase/server';

export async function addTag(
  name: string
): Promise<ActionResponse<DisplayTag>> {
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
          user_id: validatedData.data.user_id
        }
      ])
      .select('id, name');

    if (error) {
      return {
        success: false,
        message: 'タグの追加に失敗しました'
      };
    }

    return {
      success: true,
      message: '1件のタグを追加しました',
      state: data[0]
    };
  } catch (error) {
    console.error('予期せぬエラーが発生しました:', error);

    return {
      success: false,
      message: '予期せぬエラーが発生しました'
    };
  }
}
