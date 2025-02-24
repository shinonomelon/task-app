import { startTransition, useCallback, useOptimistic } from 'react';
import { toast } from 'sonner';

type ActionResponse = {
  success: boolean;
  message: string;
};

export function useOptimisticAction<T>(initialData: T[]) {
  const [optimisticList, setOptimisticList] = useOptimistic(
    initialData,
    (_, newState: T[]) => newState
  );

  const execute = useCallback(
    async (
      updateFn: (data: T[]) => T[],
      action: () => Promise<ActionResponse>,
      undoFn?: () => Promise<ActionResponse>
    ) => {
      const previousData = optimisticList;

      startTransition(async () => {
        setOptimisticList(updateFn(previousData));

        const response = await action();

        if (response.success) {
          toast.success(response.message, {
            action: undoFn
              ? {
                  label: '取り消す',
                  onClick: () => {
                    startTransition(async () => {
                      setOptimisticList(previousData);
                      await undoFn();
                    });
                  }
                }
              : undefined
          });
        } else {
          setOptimisticList(previousData);
          toast.error(response.message, {
            style: {
              background: 'red',
              color: 'white'
            }
          });
        }
      });
    },
    [optimisticList, setOptimisticList]
  );

  return {
    optimisticList,
    execute
  };
}
