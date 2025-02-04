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
import { Textarea } from '@/components/ui/textarea';

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
          <div className="mb-4 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Input
                className="border-none px-0 py-1 text-xl font-medium shadow-none focus-visible:ring-0"
                type="text"
                name="title"
                minLength={1}
                maxLength={100}
                placeholder="タスク名"
                required
              />
              {state.errors?.title && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>タスクを入力してください</AlertTitle>
                  <AlertDescription>
                    {state.errors.title.join(', ')}
                  </AlertDescription>
                </Alert>
              )}
              <Textarea
                className="min-h-12 resize-none border-none bg-transparent px-0 py-1 font-medium shadow-none focus-visible:ring-0"
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
            <div className="flex flex-col gap-2">
              <Label className="flex flex-col gap-3">
                <span>優先度</span>
                <PrioritySelect />
              </Label>
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
              <Label className="flex flex-col gap-3">
                <span>期限</span>
                <DatePicker />
              </Label>
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
            <div className="flex justify-end gap-2">
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
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
