'use client';

import { Menu, Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { AddTaskDialog } from './add-task-dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSidebar } from '@/components/ui/sidebar';

import { useSearchStore } from '@/hooks/use-search';

export const AppHeader = ({ title }: { title: string }) => {
  const { toggleSidebar } = useSidebar();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const { searchQuery, setSearchQuery } = useSearchStore();

  return (
    <header className="mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <Button onClick={toggleSidebar} variant="ghost">
          <Menu />
        </Button>
        <h1 className="ml-2 text-2xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center justify-end gap-2">
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
    </header>
  );
};
