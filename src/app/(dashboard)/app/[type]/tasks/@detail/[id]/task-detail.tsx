'use client';

import { AlertCircle, LoaderCircle } from 'lucide-react';
import { useActionState, useState } from 'react';
import { toast } from 'sonner';

import { ActionResponse, DisplayTask, EditTask } from '@/types/task';

import { cn } from '@/lib/utils/cn';

import { DatePicker } from '@/components/task/date-picker';
import { PrioritySelect } from '@/components/task/priority-select';
import { TagSelect } from '@/components/task/tag-select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { editTask } from '@/actions/task/edit-task';
import { useMediaQuery } from '@/hooks/use-media-query';

export const TaskDetailView = ({ task }: { task: DisplayTask }) => {
  const [checked, setChecked] = useState(task.completed);
  const [state, action, isPending] = useActionState<
    ActionResponse<EditTask>,
    FormData
  >(
    async (prevState: ActionResponse<EditTask> | null, formData: FormData) => {
      const response = await editTask(prevState, formData);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message, {
          style: {
            background: 'red',
            color: 'white'
          }
        });
      }
      return response;
    },
    {
      success: false,
      message: ''
    }
  );

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (!isDesktop) {
    return <div>modal</div>;
  }

  return (
    <form action={action}>
      <input type="hidden" name="id" value={task.id} />
      <div className="mb-4 flex flex-col">
        <div className="flex h-full gap-4">
          <Checkbox
            className={cn('mt-1.5 size-6 border-2', {
              'border-red-600 bg-red-100': task.priority === 'high',
              'border-yellow-600 bg-yellow-100': task.priority === 'medium',
              'opacity-40': task.completed
            })}
            name="completed"
            defaultChecked={checked}
            value={checked ? 'true' : 'false'}
            onClick={() => setChecked(!checked)}
          />
          <div className="flex w-full flex-col gap-2">
            <Input
              className="border-none px-0 py-1 text-xl font-medium shadow-none focus-visible:ring-0"
              type="text"
              defaultValue={task.title}
              name="title"
              minLength={2}
              maxLength={100}
              placeholder="タスク名"
              required
            />
            {state.errors?.title && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>タスク名を入力してください</AlertTitle>
                <AlertDescription>
                  {state.errors.title.join(', ')}
                </AlertDescription>
              </Alert>
            )}
            <Textarea
              className="min-h-28 resize-none border-none bg-transparent px-0 py-1 font-medium shadow-none focus-visible:ring-0"
              defaultValue={task.description ?? ''}
              name="description"
              minLength={1}
              placeholder="タスクの説明"
            />
            {state.errors?.description && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>タスクの説明を正しく入力してください</AlertTitle>
                <AlertDescription>
                  {state.errors.description.join(', ')}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-4 pl-6">
        <div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              タグ
            </span>
            <TagSelect defaultValue={task.tags} />
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">
            優先度
          </span>
          <PrioritySelect defaultValue={task.priority} />
          {state.errors?.priority && (
            <div className="mt-1 text-sm text-red-500" role="alert">
              {state.errors.priority.join(', ')}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">
            期限
          </span>
          <DatePicker defaultValue={task.deadline} />
          {state.errors?.deadline && (
            <div className="mt-1 text-sm text-red-500" role="alert">
              {state.errors.deadline.join(', ')}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <Button type="button" variant="outline">
          キャンセル
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="space-x-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin" />
              <span>保存中</span>
            </>
          ) : (
            <span>保存</span>
          )}
        </Button>
      </div>
    </form>
  );
};
