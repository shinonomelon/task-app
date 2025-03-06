import { Plus, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { SearchResult } from '@/types/search';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { NAV_ITEMS } from '@/constants/nav';

type SearchResultsProps = {
  searchQuery: string;
  results: SearchResult;
  onClose: () => void;
};

type SearchItem =
  | { type: 'new' }
  | { type: 'nav'; href: string; title: string }
  | { type: 'task'; id: string; title: string }
  | { type: 'tag'; id: string; name: string };

export const SearchResults = ({
  searchQuery,
  results,
  onClose
}: SearchResultsProps) => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allItems: SearchItem[] =
    searchQuery.trim() === ''
      ? [
          { type: 'new' } as const,
          ...NAV_ITEMS.map((item) => ({
            type: 'nav' as const,
            href: item.href,
            title: item.title
          }))
        ]
      : [
          ...results.tasks.map((task) => ({
            type: 'task' as const,
            id: task.id,
            title: task.title
          })),
          ...results.tags.map((tag) => ({
            type: 'tag' as const,
            id: tag.id,
            name: tag.name
          }))
        ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < allItems.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          const selectedItem = allItems[selectedIndex];
          if (!selectedItem) return;

          onClose();
          switch (selectedItem.type) {
            case 'nav':
              router.push(selectedItem.href);
              break;
            case 'tag':
              router.push(`/app/tags/${selectedItem.id}`);
              break;
            case 'task':
              break;
            case 'new':
              break;
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, allItems, onClose, router]);

  if (searchQuery.trim() === '') {
    return (
      <div className="px-2 pt-2">
        <Button
          key="タスクを追加"
          variant="ghost"
          onClick={() => {
            onClose();
          }}
          className={`flex w-full items-center justify-start rounded-md p-2 ${selectedIndex === 0 ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
        >
          <Plus className="mr-2 size-4" />
          <span>タスクを追加</span>
        </Button>
        {NAV_ITEMS.map((item, index) => (
          <Button
            key={item.title}
            variant="ghost"
            onClick={() => {
              onClose();
              router.push(item.href);
            }}
            className={`flex w-full items-center justify-start rounded-md p-2 ${selectedIndex === index + 1 ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
          >
            <item.icon className="mr-2 size-4" />
            <span>{item.title}</span>
          </Button>
        ))}
      </div>
    );
  }

  if (results.tasks.length === 0 && results.tags.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-sm text-gray-500">
        検索結果が見つかりませんでした
      </div>
    );
  }

  return (
    <>
      {results.tasks.length > 0 && (
        <>
          <div className="mt-2 px-4 py-2">
            <h3 className="text-sm font-medium text-gray-500">タスク</h3>
          </div>
          <div className="px-2">
            {results.tasks.map((task, index) => (
              <div
                key={task.id}
                className={`flex w-full items-center justify-start rounded-md p-2 ${selectedIndex === index ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
              >
                <Checkbox className="mr-2 size-4" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{task.title}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {results.tags.length > 0 && (
        <>
          <div className="mt-2 px-4 py-2">
            <h3 className="text-sm font-medium text-gray-500">タグ</h3>
          </div>
          <div className="px-2">
            {results.tags.map((tag, index) => (
              <Button
                key={tag.id}
                variant="ghost"
                onClick={() => {
                  onClose();
                  router.push(`/app/tags/${tag.id}`);
                }}
                className={`flex w-full items-center justify-start rounded-md p-2 ${selectedIndex === results.tasks.length + index ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
              >
                <Tag className="mr-2 size-4" />
                <span className="text-sm">{tag.name}</span>
              </Button>
            ))}
          </div>
        </>
      )}
    </>
  );
};
