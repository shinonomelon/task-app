'use client';

import { LoaderCircle } from 'lucide-react';
import { useActionState } from 'react';
import { toast } from 'sonner';

import { DatePicker } from './date-picker';
import { PrioritySelect } from './priority-select';

import { ActionResponse, DisplayTask, EditTask } from '@/types/task';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

      <DialogContent className="sm:max-w-[425px]">
        <form action={action}>
          <DialogHeader className="mb-4">
            <DialogTitle>タスクを編集</DialogTitle>
          </DialogHeader>
          <input type="hidden" name="id" value={task.id} />
          <input
            type="hidden"
            name="completed"
            value={task.completed ? 'true' : 'false'}
          />
          <div className="mb-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="text">タスク</Label>
              <Input
                id="text"
                defaultValue={task.text}
                type="text"
                name="text"
                minLength={2}
                maxLength={100}
                required
                autoFocus
                placeholder="新しいタスクを入力してください"
              />
              {state.errors?.text && (
                <div className="mt-1 text-sm text-red-500" role="alert">
                  {state.errors.text.join(', ')}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="priority">優先度</Label>
              <PrioritySelect defaultValue={task.priority} />
              {state.errors?.priority && (
                <div className="mt-1 text-sm text-red-500" role="alert">
                  {state.errors.priority.join(', ')}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="deadline">期限</Label>
              <DatePicker defaultValue={task.deadline} />
              {state.errors?.deadline && (
                <div className="mt-1 text-sm text-red-500" role="alert">
                  {state.errors.deadline.join(', ')}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 disabled:cursor-not-allowed disabled:opacity-50"
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
