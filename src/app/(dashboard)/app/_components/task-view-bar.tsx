'use client';

import { Calendar, List, Plus, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { AddTaskDialog } from './add-task-dialog';

import { cn } from '@/lib/utils/cn';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useSearchStore } from '@/hooks/use-search';

export const TaskViewBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const { searchQuery, setSearchQuery } = useSearchStore();

  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className={cn(
            'text-muted-foreground',
            (!view || view === 'list') && 'font-medium text-primary bg-accent'
          )}
          onClick={() => {
            router.push(`/app/inbox?view=list`);
          }}
          aria-label="リスト表示"
        >
          <List className="size-4 md:mr-2" />
          <span className="hidden md:block">リスト</span>
        </Button>
        <Button
          variant="ghost"
          className={cn(
            'text-muted-foreground',
            view === 'calendar' && 'font-medium text-primary bg-accent'
          )}
          onClick={() => {
            router.push(`/app/inbox?view=calendar`);
          }}
          aria-label="カレンダー表示"
        >
          <Calendar className="size-4 md:mr-2" />
          <span className="hidden md:block">カレンダー</span>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {isSearchOpen ? (
          <div className="relative">
            <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2" />
            <Input
              className="pl-8"
              placeholder="検索..."
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            aria-label="タスクを検索"
          >
            <Search className="size-4" />
          </Button>
        )}
        <AddTaskDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <Button
            className="gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="タスクを追加"
          >
            <Plus className="size-4" />
            <span className="hidden md:block">タスクを追加</span>
          </Button>
        </AddTaskDialog>
      </div>
    </div>
  );
};
