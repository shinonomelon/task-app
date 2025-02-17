import { z } from 'zod';

export const addTaskSchema = z.object({
  title: z.string().min(1, 'タスク名は必須です'),
  description: z.string().nullable(),
  deadline: z.string().nullable(),
  include_time: z.boolean(),
  priority: z.enum(['low', 'medium', 'high']),
  user_id: z.string().min(1, 'ユーザーIDが必要です')
});

export const editTaskSchema = z.object({
  id: z.string().uuid('IDはUUIDでなければなりません'),
  title: z.string().min(1, 'タスク名は必須です'),
  description: z.string().nullable(),
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

export const addTagSchema = z.object({
  name: z.string().min(1, 'タグ名は必須です'),
  color: z.string().min(1, '色は必須です'),
  user_id: z.string().min(1, 'ユーザーIDが必要です')
});
