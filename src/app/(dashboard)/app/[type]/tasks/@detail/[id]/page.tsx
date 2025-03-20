import { TaskDetailView } from './task-detail';

import { getTaskList } from '@/actions/api/task';

export default async function DetailIdPage({
  params
}: {
  params: { id: string };
}) {
  const taskList = await getTaskList();
  const task = taskList.find((task) => task.id === params.id);
  if (!task) {
    return null;
  }
  return <TaskDetailView task={task} />;
}
