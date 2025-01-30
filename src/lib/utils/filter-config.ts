import { isSameDay } from 'date-fns';

import { DisplayTask } from '@/types/task';

export const filterConfig = {
  all: {
    filterFn: (task: DisplayTask) => !task.completed,
    showForm: true
  },
  completed: {
    filterFn: (task: DisplayTask) => task.completed,
    showForm: false
  },
  overdue: {
    filterFn: (task: DisplayTask) => {
      if (!task.deadline || task.completed) return false;
      const deadlineDate = new Date(task.deadline);
      return !isSameDay(deadlineDate, new Date()) && deadlineDate < new Date();
    },
    showForm: false
  },
  today: {
    filterFn: (task: DisplayTask) => {
      if (task.completed || !task.deadline) return false;
      const deadlineDate = new Date(task.deadline);
      return (
        !isNaN(deadlineDate.getTime()) && isSameDay(deadlineDate, new Date())
      );
    },
    showForm: true
  }
} as const;
