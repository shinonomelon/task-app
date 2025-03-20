import type { Metadata } from 'next';

import { CustomSuspense } from '@/lib/utils/custom-suspense';

import { AppHeader } from '@/components/app-header';
import { TaskListView } from '@/components/task/task-list-view';

import { getTagById } from '@/actions/api/tag';
import { getTaskList } from '@/actions/api/task';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const { data: tag } = await getTagById(id);

  return {
    title: tag.name
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const { data: tag } = await getTagById(id);

  const promiseTaskList = getTaskList();

  return (
    <div className="p-2">
      <AppHeader title={`# ${tag.name}`} />
      <CustomSuspense height={100} width="100%">
        <TaskListView
          promiseTaskList={promiseTaskList}
          filterByList={['all']}
          filterByTagId={id}
        />
      </CustomSuspense>
    </div>
  );
}
