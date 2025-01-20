'use client';

import { LoaderCircle, Plus } from 'lucide-react';
import { useActionState, useState } from 'react';

import { addTask } from '../actions';
import { ActionResponse } from '../types';

import { DatePicker } from './date-picker';
import { PrioritySelect } from './priority-select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const initialState: ActionResponse = {
  success: false,
  message: ''
};

export const TaskForm = () => {
  const [state, action, isPending] = useActionState(addTask, initialState);

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
          <div className="flex gap-2">
            <DatePicker />
            <PrioritySelect />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={handleCancel}>
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
