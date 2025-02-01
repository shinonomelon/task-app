import { getTaskCounts } from '@/actions/api/task';

export const TaskSummary = async () => {
  const { data: taskCounts } = await getTaskCounts();

  if (!taskCounts) {
    return null;
  }

  const totalTaskCount = taskCounts[0]?.total_count ?? 0;
  const completedTaskCount = taskCounts[0]?.completed_count ?? 0;
  const pendingTaskCount =
    (taskCounts[0]?.total_count ?? 0) - (taskCounts[0]?.completed_count ?? 0);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <TaskCard title="未完了タスク" count={pendingTaskCount} />
      <TaskCard title="完了タスク" count={completedTaskCount} />
      <TaskCard title="総タスク数" count={totalTaskCount} />
    </div>
  );
};

const TaskCard = ({ title, count }: { title: string; count: number }) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <div className="pt-2">
        <div className="text-2xl font-bold">{count}</div>
      </div>
    </div>
  );
};
