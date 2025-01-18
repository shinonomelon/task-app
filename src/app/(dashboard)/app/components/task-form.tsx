'use client';

import { Plus } from 'lucide-react';
import { useActionState } from 'react';

import { addTodo } from '@/src/actions/task';
import { LoadingSpinner } from '@/src/components/loading-spinner';
import { Button } from '@/src/components/ui/button';
import { ActionResponse } from '@/src/types/task';

const initialState: ActionResponse = {
  success: false,
  message: ''
};

export const TaskForm = () => {
  const [state, action, isPending] = useActionState(addTodo, initialState);

  return (
    <div className="p-6">
      <form action={action} className="space-y-4">
        <div>
          <input
            type="text"
            name="text"
            minLength={2}
            maxLength={100}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="新しいTodoを入力してください"
          />
          {state.errors?.text && (
            <div className="mt-1 text-sm text-red-500" role="alert">
              {state.errors.text.join(', ')}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline">キャンセル</Button>
          <Button
            type="submit"
            disabled={isPending}
            className="gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <LoadingSpinner />
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
    </div>
  );
};
