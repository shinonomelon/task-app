import { z } from 'zod';

export const addTaskSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  deadline: z.string().nullable(),
  include_time: z.boolean(),
  priority: z.enum(['low', 'medium', 'high']),
  user_id: z.string().min(1, 'ユーザーIDが必要です')
});

export const editTaskSchema = z.object({
  id: z.string().uuid('IDはUUIDでなければなりません'),
  text: z.string().min(1, 'テキストは必須です'),
  deadline: z.string().nullable(),
  include_time: z.boolean(),
  priority: z.enum(['low', 'medium', 'high']),
  completed: z.boolean(),
  user_id: z.string().uuid('ユーザーIDはUUIDでなければなりません')
});

export const toggleTaskCompletedSchema = z.object({
  id: z.string().uuid('IDはUUIDでなければなりません'),
  completed: z.boolean(),
  user_id: z.string().uuid('ユーザーIDはUUIDでなければなりません')
});

export const deleteTaskSchema = z.object({
  id: z.string().uuid('IDはUUIDでなければなりません'),
  user_id: z.string().uuid('ユーザーIDはUUIDでなければなりません')
});

export const deleteTaskListSchema = z.object({
  idList: z.array(z.string().uuid('IDはUUIDでなければなりません')),
  user_id: z.string().uuid('ユーザーIDはUUIDでなければなりません')
});
