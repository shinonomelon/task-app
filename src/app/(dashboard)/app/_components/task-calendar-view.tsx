'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { EditTaskDialog } from './edit-task-dialog';

import { DisplayTask } from '@/types/task';

import { cn } from '@/lib/utils/cn';

import { Button } from '@/components/ui/button';

import { useTask } from '@/hooks/use-task';

const DAYS_OF_WEEK = ['日', '月', '火', '水', '木', '金', '土'];

const getDateString = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const TaskCalendarView = ({ tasks }: { tasks: DisplayTask[] }) => {
  const { optimisticTaskList } = useTask(tasks);

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
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleToday}>
              今日
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
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
              getDateString(new Date(task.deadline)) ===
                getDateString(currentDate)
          );

          const isCurrentMonth = currentDate.getMonth() === date.getMonth();

          return (
            <div
              key={i}
              className={cn(
                'min-h-28 rounded-none p-2',
                !isCurrentMonth && 'bg-muted/50'
              )}
            >
              <div
                className={cn(
                  'mb-2 text-sm w-6 h-6 flex items-center justify-center rounded-full',
                  getDateString(currentDate) === getDateString(new Date()) &&
                    'text-white bg-red-500'
                )}
              >
                {currentDate.getDate()}
              </div>
              <div className="flex flex-col gap-1">
                {[...dayTasks]
                  .sort((a, b) => {
                    if (a.completed && !b.completed) return -1;
                    if (!a.completed && b.completed) return 1;

                    if (!a.completed && !b.completed) {
                      const aIsOverdue =
                        a.deadline && new Date(a.deadline) < new Date();
                      const bIsOverdue =
                        b.deadline && new Date(b.deadline) < new Date();

                      if (aIsOverdue && !bIsOverdue) return -1;
                      if (!aIsOverdue && bIsOverdue) return 1;
                    }

                    return 0;
                  })
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
  const isOverdue = task.deadline && new Date(task.deadline) < new Date();

  return (
    <EditTaskDialog
      key={task.id}
      task={task}
      open={open}
      onOpenChange={setOpen}
    >
      <div
        key={task.id}
        className={cn(
          'rounded-sm cursor-pointer hover:brightness-95',
          task.completed && 'bg-blue-100',
          !task.completed && isOverdue && 'bg-red-100',
          !task.completed && !isOverdue && 'bg-gray-100'
        )}
      >
        <div
          className={cn(
            'text-sm p-0.5 truncate',
            task.completed && 'line-through'
          )}
        >
          {task.text}
        </div>
      </div>
    </EditTaskDialog>
  );
};
