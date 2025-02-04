'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';

import { TodayTaskSummary as TodayTaskSummaryType } from '@/types/task';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function TodayTaskSummary({
  completed_task,
  total_task,
  latest_task_list
}: TodayTaskSummaryType) {
  const progressPercentage = total_task
    ? (completed_task / total_task) * 100
    : 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">今日のタスク進捗</h2>
      {total_task > 0 ? (
        <>
          <Progress value={progressPercentage} className="h-4 w-full" />
          <div className="flex flex-row items-center justify-between">
            <span>
              {completed_task}/{total_task} 完了
            </span>
            <span>{progressPercentage.toFixed(0)}%</span>
          </div>
        </>
      ) : (
        <Button size="sm" asChild>
          <Link href="/app/today">今日のタスクを追加しましょう</Link>
        </Button>
      )}
      <div className="space-y-2">
        <div className="font-semibold">最近のタスク</div>
        <div className="space-y-2">
          {latest_task_list?.map((task, index) => (
            <div key={index} className="flex items-center space-x-2">
              {index < completed_task ? (
                <CheckCircle2 className="text-green-500" />
              ) : (
                <Circle className="text-gray-300" />
              )}
              <span className="text-sm">{task.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
