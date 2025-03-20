import { TaskDetailView } from './task-detail';

import { getTaskList } from '@/actions/api/task';

export default async function DetailIdPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const taskList = await getTaskList();
  const task = taskList.find((task) => task.id === id);
  if (!task) {
    return null;
  }
  return <TaskDetailView task={task} />;
}
