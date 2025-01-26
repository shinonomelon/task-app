import { isSameDay } from 'date-fns';

import { Task } from '@/types/task';

export const filterConfig = {
  all: {
    filterFn: (task: Task) => !task.completed,
    showForm: true
  },
  completed: {
    filterFn: (task: Task) => task.completed,
    showForm: false
  },
  overdue: {
    filterFn: (task: Task) => {
      if (!task.deadline || task.completed) return false;
      const deadlineDate = new Date(task.deadline);
      return !isSameDay(deadlineDate, new Date()) && deadlineDate < new Date();
    },
    showForm: false
  },
  today: {
    filterFn: (task: Task) => {
      if (task.completed || !task.deadline) return false;
      const deadlineDate = new Date(task.deadline);
      return (
        !isNaN(deadlineDate.getTime()) && isSameDay(deadlineDate, new Date())
      );
    },
    showForm: true
  }
} as const;
