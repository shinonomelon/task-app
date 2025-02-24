'use client';

import { LoaderCircle, Square, SquareCheck } from 'lucide-react';
import { startTransition, useActionState, useEffect, useState } from 'react';

import type { DisplayTag } from '@/types/task';

import { createClient } from '@/lib/supabase/client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { addTag } from '@/actions/task/add-tag';

export const TagSelect = ({
  defaultValue
}: {
  defaultValue?: DisplayTag[];
}) => {
  const [tags, setTags] = useState<DisplayTag[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<DisplayTag[]>(
    defaultValue || []
  );
  const [searchTerm, setSearchTerm] = useState('');

  const [state, createTag, isPending] = useActionState(
    async () => {
      const { success, message, state } = await addTag(searchTerm);
      if (success && state) {
        setSearchTerm('');
        setSelectedTags((prev) => [...prev, state]);
      }
      return {
        success,
        message
      };
    },
    {
      success: false,
      message: ''
    }
  );

  useEffect(() => {
    const fetchTags = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('tags')
        .select('id, name')
        .order('created_at', { ascending: true });
      if (error) throw error;
      setTags(data);
    };
    fetchTags();
  }, [state]);

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTagSelect = (tag: DisplayTag) => {
    if (selectedTags.some((t) => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleNewTag = () => {
    startTransition(() => {
      createTag();
    });
  };

  return (
    <div className="relative">
      <div className="mb-2 flex max-h-20 flex-wrap gap-2 overflow-y-auto">
        {selectedTags.map((tag) => (
          <div
            key={tag.id}
            className="cursor-pointer rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-800"
            onClick={() => handleTagSelect(tag)}
          >
            {tag.name}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full justify-start"
      >
        タグを追加
      </Button>

      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-white p-2">
          <Input
            type="text"
            placeholder="タグを検索..."
            value={searchTerm}
            autoFocus
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />

          <div className="max-h-40 overflow-y-auto">
            {searchTerm.trim() && filteredTags.length === 0 ? (
              <Button
                className="w-full gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                disabled={isPending}
                onClick={handleNewTag}
              >
                {isPending ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    <span>作成中</span>
                  </>
                ) : (
                  <>{searchTerm}：新規作成</>
                )}
              </Button>
            ) : (
              filteredTags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex cursor-pointer justify-between px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => handleTagSelect(tag)}
                >
                  <span>{tag.name}</span>
                  {selectedTags.some((t) => t.id === tag.id) ? (
                    <SquareCheck />
                  ) : (
                    <Square />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <input
        type="hidden"
        name="tags"
        value={selectedTags.map((tag) => tag.id).join(',')}
      />
    </div>
  );
};
