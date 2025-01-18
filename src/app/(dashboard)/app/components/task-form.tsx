'use client';

import { LoaderCircle, Plus } from 'lucide-react';
import { useActionState, useState } from 'react';

import { addTodo } from '@/src/actions/task';
import { Button } from '@/src/components/ui/button';
import { ActionResponse } from '@/src/types/task';

const initialState: ActionResponse = {
  success: false,
  message: ''
};

export const TaskForm = () => {
  const [state, action, isPending] = useActionState(addTodo, initialState);

  const [showForm, setShowForm] = useState(false);

  const handleAddButtonClick = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div>
      {!showForm && (
        <Button
          variant="ghost"
          className="mt-2 w-full gap-2"
          onClick={handleAddButtonClick}
        >
          <Plus className="size-4" />
          <span>タスクを追加</span>
        </Button>
      )}
      {showForm && (
        <form action={action} className="mt-4 space-y-4">
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
            <Button variant="outline" onClick={handleCancel}>
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
