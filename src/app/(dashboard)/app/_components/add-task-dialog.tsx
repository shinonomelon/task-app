'use client';

import { AlertCircle, LoaderCircle } from 'lucide-react';
import { useActionState } from 'react';
import { toast } from 'sonner';

import { DatePicker } from './date-picker';
import { PrioritySelect } from './priority-select';

import { ActionResponse, AddTask } from '@/types/task';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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

import { addTask } from '@/actions/task/add-task';

type AddTaskDialogProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AddTaskDialog = ({
  children,
  open,
  onOpenChange
}: AddTaskDialogProps) => {
  const [state, action, isPending] = useActionState<
    ActionResponse<AddTask>,
    FormData
  >(
    async (prevState: ActionResponse<AddTask> | null, formData: FormData) => {
      const response = await addTask(prevState, formData);
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
            <DialogTitle>タスクを追加</DialogTitle>
          </DialogHeader>
          <div className="mb-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="text">タスク</Label>
              <Input
                id="text"
                type="text"
                name="text"
                minLength={2}
                maxLength={100}
                required
                autoFocus
                placeholder="新しいタスクを入力してください"
              />
              {state.errors?.text && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>タスクを入力してください</AlertTitle>
                  <AlertDescription>
                    {state.errors.text.join(', ')}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="priority">優先度</Label>
              <PrioritySelect />
              {state.errors?.priority && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>優先度を選択してください</AlertTitle>
                  <AlertDescription>
                    {state.errors.priority.join(', ')}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="deadline">期限</Label>
              <DatePicker />
              {state.errors?.deadline && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>期限を選択してください</AlertTitle>
                  <AlertDescription>
                    {state.errors.deadline.join(', ')}
                  </AlertDescription>
                </Alert>
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
