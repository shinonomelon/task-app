import { createClient } from '@/lib/supabase/server';

export const TaskSummary = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_task_counts');

  if (error) {
    return (
      <div className="rounded-lg bg-red-100 p-4 text-red-500" role="alert">
        エラーが発生しました: {error.message}
      </div>
    );
  }

  const totalTaskCount = data[0]?.total_count ?? 0;
  const completedTaskCount = data[0]?.completed_count ?? 0;
  const pendingTaskCount =
    (data[0]?.total_count ?? 0) - (data[0]?.completed_count ?? 0);

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
