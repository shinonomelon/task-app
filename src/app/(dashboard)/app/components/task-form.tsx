'use client';

import { useActionState } from 'react';

import { addTodo } from '../../../../actions/task';
import { LoadingSpinner } from '../../../../components/loading-spinner';
import { ActionResponse } from '../../../../types/task';

const initialState: ActionResponse = {
  success: false,
  message: ''
};

export const TaskForm = () => {
  const [state, action, isPending] = useActionState(addTodo, initialState);

  return (
    <div className="rounded-lg bg-white p-6 dark:bg-gray-800">
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
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-blue-500 px-4 py-2 font-semibold text-white transition duration-150 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {isPending ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner />
              <span className="ml-2">送信中</span>
            </div>
          ) : (
            '追加'
          )}
        </button>
      </form>
    </div>
  );
};
