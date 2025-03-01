import { AppHeader } from '../../_components/app-header';
import { TaskListView } from '../../_components/task-list-view';

import type { Metadata } from 'next';

import { CustomSuspense } from '@/lib/utils/custom-suspense';

import { getTagById } from '@/actions/api/tag';
import { getTaskList } from '@/actions/api/task';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const { data: tag } = await getTagById(id);

  return {
    title: tag.name
  };
}

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: tag } = await getTagById(id);

  return (
    <>
      <AppHeader title={`# ${tag.name}`} />
      <CustomSuspense height={100} width="100%">
        <TaskView id={id} />
      </CustomSuspense>
    </>
  );
}

const TaskView = async ({ id }: { id: string }) => {
  const { data: tasks } = await getTaskList();

  return (
    <TaskListView
      tasks={tasks.filter((task) =>
        task.tags.map((tag) => tag.id).includes(id)
      )}
      filterByList={['all', 'completed']}
    />
  );
};
