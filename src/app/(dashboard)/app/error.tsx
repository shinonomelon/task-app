'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">エラーが発生しました</h2>

      <Button onClick={() => reset()}>もう一度試してみる</Button>
    </div>
  );
}
