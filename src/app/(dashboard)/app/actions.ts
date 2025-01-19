'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { ActionResponse, Task } from './types';

import { createClient } from '@/lib/supabase/server';

const taskSchema = z.object({
  text: z.string().min(1, 'Text is required')
});

export async function addTask(
  prevState: ActionResponse | null,
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
        message: 'Authentication failed. Please log in again.'
      };
    }

    const rawData: Pick<Task, 'text'> = {
      text: formData.get('text') as string
    };

    const validatedData = taskSchema.safeParse(rawData);

    console.log('validatedData', validatedData);

    if (!validatedData.success) {
      return {
        success: false,
        message: 'Failed to add task',
        errors: validatedData.error.flatten().fieldErrors
      };
    }

    const { error } = await supabase
      .from('tasks')
      .insert([{ text: validatedData.data.text, user_id: user.id }])
      .select();

    if (error) {
      return {
        success: false,
        message: 'Failed to add task',
        errors: {
          text: [error.message]
        }
      };
    }

    revalidatePath('/');

    return {
      success: true,
      message: 'Task added successfully'
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
}

export async function deleteTask(id: number): Promise<ActionResponse> {
  try {
    if (typeof id !== 'number') {
      return {
        success: false,
        message: 'Failed to delete task',
        errors: {
          id: ['ID is required']
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
        message: 'Failed to delete task',
        errors: {
          id: [error.message]
        }
      };
    }
    revalidatePath('/');

    return {
      success: true,
      message: 'Task deleted successfully'
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
}

export async function toggleTaskCompleted(
  id: number,
  completed: boolean
): Promise<ActionResponse> {
  try {
    if (typeof id !== 'number') {
      return {
        success: false,
        message: 'Failed to update task',
        errors: {
          id: ['ID is required']
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
        message: 'Failed to update task',
        errors: {
          id: [error.message]
        }
      };
    }
    revalidatePath('/');

    return {
      success: true,
      message: 'Task updated successfully'
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
}

export async function editTask(
  id: number,
  text: string
): Promise<ActionResponse> {
  try {
    if (
      typeof id !== 'number' ||
      typeof text !== 'string' ||
      text.trim() === ''
    ) {
      return {
        success: false,
        message: 'Failed to edit task',
        errors: {
          id: ['Valid ID is required'],
          text: ['Text is required']
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
        message: 'Failed to edit task',
        errors: {
          text: [error.message]
        }
      };
    }

    revalidatePath('/');

    return {
      success: true,
      message: 'Task edited successfully'
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
