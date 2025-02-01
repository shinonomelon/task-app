import { OverAllSummary } from './over-all-summary';
import TodaySummary from './today-task-summary';

import { getTaskSummary } from '@/actions/api/task';

export const TaskSummary = async () => {
  const { data } = await getTaskSummary();

  if (!data) {
    return null;
  }

  const { overall, today } = data;

  return (
    <div className="space-y-6">
      <OverAllSummary {...overall} />
      <TodaySummary {...today} />
    </div>
  );
};
