'use client';

import { isToday } from 'date-fns';
import { AlertCircle, Calendar, Flag, Tag, Trash } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { DisplayTask } from '@/types/task';

import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/date-formatter';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

export const TaskItem = ({
  task,
  handleToggleTask,
  handleDeleteTask,
  isSelected,
  handleToggleSelect
}: {
  task: DisplayTask;
  handleToggleTask: ({
    id,
    completed
  }: {
    id: string;
    completed: boolean;
  }) => void;
  handleDeleteTask: ({ id }: { id: string }) => void;
  isSelected: boolean;
  handleToggleSelect: (id: string) => void;
}) => {
  const pathname = usePathname();
  const isPastDue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    !isToday(new Date(task.deadline));

  // 優先度に基づくアイコンと色の設定
  const priorityConfig = {
    high: {
      icon: <Flag className="size-4 text-red-600" />,
      color: 'border-red-200 bg-red-50'
    },
    medium: {
      icon: <Flag className="size-4 text-yellow-600" />,
      color: 'border-yellow-200 bg-yellow-50'
    },
    low: {
      icon: <Flag className="size-4 text-green-600" />,
      color: 'border-green-200 bg-green-50'
    }
  };

  return (
    <li className="group relative mb-3 overflow-hidden hover:bg-gray-100">
      <Link
        href={
          pathname.includes('inbox')
            ? `/app/inbox/tasks/${task.id}`
            : `/app/today/tasks/${task.id}`
        }
        className="flex items-start p-4"
      >
        <div className="flex items-start space-x-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isSelected}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleSelect(task.id);
              }}
              className={cn(
                'opacity-0 transition-opacity duration-200 group-hover:opacity-100',
                {
                  'opacity-100': isSelected
                }
              )}
              aria-label="タスクの選択"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Checkbox
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleTask({
                        id: task.id,
                        completed: task.completed
                      });
                    }}
                    checked={task.completed}
                    className={cn(
                      'size-6 rounded-full border-2 transition-all',
                      {
                        'border-red-600 bg-red-50': task.priority === 'high',
                        'border-yellow-600 bg-yellow-50':
                          task.priority === 'medium',
                        'border-green-600 bg-green-50': task.priority === 'low',
                        'opacity-60 border-gray-400 bg-gray-100': task.completed
                      }
                    )}
                    aria-label="タスクの完了・未完了の切り替え"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {task.completed
                    ? 'タスクを未完了に戻す'
                    : 'タスクを完了としてマーク'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3
                className={cn('text-base font-medium transition-all', {
                  'line-through text-gray-500': task.completed
                })}
              >
                {task.title}
              </h3>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {task.deadline && (
                <div
                  className={cn('flex items-center gap-1 text-xs font-normal', {
                    'text-blue-700 ': isToday(new Date(task.deadline)),
                    'text-red-700': isPastDue,
                    'text-gray-700':
                      !isToday(new Date(task.deadline)) && !isPastDue
                  })}
                >
                  {isPastDue ? (
                    <AlertCircle className="size-3" />
                  ) : (
                    <Calendar className="size-3" />
                  )}
                  {formatDate.toDisplayDate(new Date(task.deadline))}
                </div>
              )}
              {task.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="gap-1 bg-gray-50 text-xs font-normal"
                >
                  <Tag className="size-3" />
                  <span>{tag.name}</span>
                </Badge>
              ))}

              {task.priority && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="ml-2 flex shrink-0 items-center gap-1 text-xs font-normal">
                        {priorityConfig[task.priority]?.icon}
                        <span>
                          {task.priority === 'high'
                            ? '高'
                            : task.priority === 'medium'
                              ? '中'
                              : '低'}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {task.priority === 'high'
                        ? '高優先度'
                        : task.priority === 'medium'
                          ? '中優先度'
                          : '低優先度'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDeleteTask({ id: task.id });
          }}
          className="ml-auto opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-label="タスクの削除"
        >
          <Trash className="size-4 text-gray-500 hover:text-red-500" />
        </Button>
      </Link>
    </li>
  );
};
