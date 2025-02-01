export const OverAllSummary = ({ overall }: { overall: any }) => {
  return (
    <div>
      <h2 className="text-xl font-bold">全体のタスク</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <TaskCard
          title="未完了タスク"
          count={overall.total_task - overall.completed_task}
        />
        <TaskCard title="完了タスク" count={overall.completed_task} />
        <TaskCard title="総タスク数" count={overall.total_task} />
      </div>
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
