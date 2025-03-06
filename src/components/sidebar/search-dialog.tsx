'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Input } from '../ui/input';

import { SearchResults } from './search-results';

import { useSearch } from '@/hooks/use-search';

export const SearchDialog = () => {
  const [open, setOpen] = useState(false);
  const { searchQuery, setSearchQuery, results } = useSearch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }

      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="検索"
          className="flex w-full justify-start gap-2 rounded-md p-2 hover:bg-muted/80"
          variant="ghost"
        >
          <Search className="mr-2 size-4" />
          <span>検索</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="mb-2 gap-0 space-y-0 p-0 sm:max-w-[425px]">
        <DialogTitle className="sr-only">検索</DialogTitle>
        <div className="flex items-center border-b px-4 py-3">
          <Search className="size-5 text-gray-500" />
          <Input
            className="flex-1 border-none text-base shadow-none placeholder:text-gray-400 focus-visible:ring-0"
            placeholder="検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <div className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
            ⌘ K
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-2">
          <SearchResults
            searchQuery={searchQuery}
            results={results}
            onClose={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
