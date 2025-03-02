'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { EditTaskDialog } from './edit-task-dialog';

import { DisplayTask } from '@/types/task';

import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/date-formatter';

import { Button } from '@/components/ui/button';

import { useSearchStore } from '@/hooks/use-search';
import { useTask } from '@/hooks/use-task';

const DAYS_OF_WEEK = ['日', '月', '火', '水', '木', '金', '土'];

export const TaskCalendarView = ({ tasks }: { tasks: DisplayTask[] }) => {
  const { optimisticTaskList } = useTask(tasks);
  const { searchQuery } = useSearchStore();

  const [date, setDate] = useState<Date>(new Date());

  const handlePrevMonth = () => {
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  const startDayOfWeek = firstDayOfMonth.getDay();

  const startDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    1 - startDayOfWeek
  );

  const calendarDays = Array.from({ length: 42 }).map((_, i) => {
    return new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + i
    );
  });

  const monthLabel = `${date.getFullYear()}年${date.getMonth() + 1}月`;

  const handleToday = () => {
    setDate(new Date());
  };

  return (
    <>
      <div className="sticky top-0 z-10 mb-4 bg-white pt-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">{monthLabel}</div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevMonth}
              aria-label="前の月へ移動"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleToday}
              aria-label="今日へ移動"
            >
              今日
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              aria-label="次の月へ移動"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="py-2 text-center text-sm font-medium">
              {day}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7">
        {calendarDays.map((currentDate, i) => {
          const dayTasks = optimisticTaskList.filter(
            (task) =>
              task.deadline &&
              formatDate.toLocalDateString(new Date(task.deadline)) ===
                formatDate.toLocalDateString(currentDate)
          );

          const isCurrentMonth = currentDate.getMonth() === date.getMonth();

          return (
            <div
              key={i}
              className={cn(
                'min-h-28 rounded-none p-2 border-[0.5px] box-border',
                !isCurrentMonth && 'bg-muted/50'
              )}
            >
              <div
                className={cn(
                  'mb-2 text-sm w-6 h-6 flex items-center justify-center rounded-full',
                  formatDate.toLocalDateString(currentDate) ===
                    formatDate.toLocalDateString(new Date()) &&
                    'text-white bg-red-500'
                )}
              >
                {currentDate.getDate()}
              </div>
              <div className="flex flex-col gap-1">
                {dayTasks
                  .filter((task) => task.title.includes(searchQuery))
                  .map((task) => {
                    return <TaskCalendarItem key={task.id} task={task} />;
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const TaskCalendarItem = ({ task }: { task: DisplayTask }) => {
  const [open, setOpen] = useState(false);

  return (
    <EditTaskDialog task={task} open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="outline"
        aria-label={`タスクを編集: ${task.title}`}
        onClick={() => setOpen(true)}
        className="flex size-full flex-col px-2 py-1"
      >
        <div
          className={cn(
            'text-sm truncate w-full text-left',
            task.completed && 'line-through'
          )}
        >
          {task.title}
        </div>
        <div className="w-full text-left text-xs text-gray-500">
          {task.deadline &&
            task.include_time &&
            new Date(task.deadline).toLocaleString('ja-JP', {
              hour: '2-digit',
              minute: '2-digit'
            })}
        </div>
      </Button>
    </EditTaskDialog>
  );
};
