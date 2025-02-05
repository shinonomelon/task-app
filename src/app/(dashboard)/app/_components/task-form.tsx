'use client';

import { AlertCircle, LoaderCircle, Plus } from 'lucide-react';
import { useActionState, useState } from 'react';
import { toast } from 'sonner';

import { DatePicker } from './date-picker';
import { PrioritySelect } from './priority-select';

import { ActionResponse, AddTask } from '@/types/task';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { addTask } from '@/actions/task/add-task';

export const TaskForm = () => {
  const [state, action, isPending] = useActionState<
    ActionResponse<AddTask>,
    FormData
  >(
    async (prevState: ActionResponse<AddTask> | null, formData: FormData) => {
      const response = await addTask(prevState, formData);
      if (response.success) {
        toast.success(response.message);
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

  const [showForm, setShowForm] = useState(false);

  const handleAddButtonClick = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="mb-4">
      {!showForm && (
        <Button
          variant="ghost"
          className="mt-2 w-full gap-2"
          onClick={handleAddButtonClick}
          aria-label="タスクを追加"
        >
          <Plus className="size-4" />
          <span>タスクを追加</span>
        </Button>
      )}
      {showForm && (
        <form
          action={action}
          className="ml-2 mt-4 space-y-4 rounded-md border p-4"
        >
          <div>
            <Input
              className="border-none px-0 py-1 text-xl font-medium shadow-none focus-visible:ring-0"
              type="text"
              name="title"
              minLength={2}
              maxLength={100}
              placeholder="タスク名"
              required
              autoFocus
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
          <div className="flex max-w-fit gap-2">
            <DatePicker />
            <PrioritySelect />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={handleCancel}
              aria-label="タスクの追加をキャンセル"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="タスクを追加"
            >
              {isPending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  <span>追加中</span>
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  <span>タスクを追加</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
