import { FilterBy } from '@/types/task';

export const getTitle = (filterBy: FilterBy): string => {
  switch (filterBy) {
    case 'completed':
      return '完了したタスク';
    case 'today':
      return '今日のタスク';
    case 'overdue':
      return '期限切れのタスク';
    case 'all':
    default:
      return 'すべてのタスク';
  }
};
