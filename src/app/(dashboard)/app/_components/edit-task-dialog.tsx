'use client';

import { AlertCircle, LoaderCircle } from 'lucide-react';
import { useActionState, useState } from 'react';
import { toast } from 'sonner';

import { DatePicker } from './date-picker';
import { PrioritySelect } from './priority-select';

import { ActionResponse, DisplayTask, EditTask } from '@/types/task';

import { cn } from '@/lib/utils/cn';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { editTask } from '@/actions/task/edit-task';

type EditTaskDialogProps = {
  children: React.ReactNode;
  task: DisplayTask;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const EditTaskDialog = ({
  children,
  task,
  open,
  onOpenChange
}: EditTaskDialogProps) => {
  const [checked, setChecked] = useState(task.completed);
  const [state, action, isPending] = useActionState<
    ActionResponse<EditTask>,
    FormData
  >(
    async (prevState: ActionResponse<EditTask> | null, formData: FormData) => {
      const response = await editTask(prevState, formData);
      if (response.success) {
        toast.success(response.message);
        onOpenChange(false);
      } else {
        toast.error(response.message);
      }
      return response;
    },
    {
      success: false,
      message: ''
    }
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-screen-md">
        <DialogHeader>
          <DialogTitle>タスクの詳細</DialogTitle>
        </DialogHeader>
        <form action={action}>
          <div className="grid grid-cols-[1fr,240px] gap-6">
            <input type="hidden" name="id" value={task.id} />
            <div className="mb-4 flex flex-col">
              <div className="flex h-full gap-4">
                <Checkbox
                  className={cn('mt-1.5 size-6 border-2', {
                    'border-red-600 bg-red-100': task.priority === 'high',
                    'border-yellow-600 bg-yellow-100':
                      task.priority === 'medium',
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
                      <AlertTitle>
                        タスクの説明を正しく入力してください
                      </AlertTitle>
                      <AlertDescription>
                        {state.errors.description.join(', ')}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4 border-l pl-6">
              <div className="space-y-2">
                <Label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    タグ
                  </span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {task.tags?.map((tag) => (
                    <div
                      key={tag.id}
                      className={cn(
                        'rounded-full px-2 py-1 text-xs mix-blend-difference',
                        `bg-[${tag.color}]`
                      )}
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    優先度
                  </span>
                  <PrioritySelect defaultValue={task.priority} />
                </Label>
                {state.errors?.priority && (
                  <div className="mt-1 text-sm text-red-500" role="alert">
                    {state.errors.priority.join(', ')}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    期限
                  </span>
                  <DatePicker defaultValue={task.deadline} />
                </Label>
                {state.errors?.deadline && (
                  <div className="mt-1 text-sm text-red-500" role="alert">
                    {state.errors.deadline.join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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
      </DialogContent>
    </Dialog>
  );
};
