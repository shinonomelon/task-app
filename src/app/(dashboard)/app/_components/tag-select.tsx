'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { DisplayTag } from '@/types/task';

import { createClient } from '@/lib/supabase/client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

export const TagSelect = ({
  defaultValue,
  taskId
}: {
  defaultValue: DisplayTag[];
  taskId: string;
}) => {
  console.log(taskId);

  const [tags, setTags] = useState<DisplayTag[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<DisplayTag[]>(defaultValue);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('tags')
        .select('id, name, color')
        .order('created_at', { ascending: true });
      if (error) throw error;
      setTags(data);
    };
    fetchTags();
  }, []);

  const handleSelect = (tag: DisplayTag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <>
      <div className="flex max-h-20 flex-wrap gap-2 overflow-y-auto">
        {selectedTags.map((tag) => (
          <div
            style={{ backgroundColor: tag.color }}
            className="rounded-full px-2 py-1 text-xs mix-blend-difference"
            key={tag.id}
          >
            {tag.name}
          </div>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" className="mt-2">
            タグを追加
            <Plus className="size-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-fit p-0" align="center">
          <Command>
            <CommandInput
              placeholder="タグを検索..."
              className="h-9"
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="max-h-[300px] w-full overflow-y-auto">
              <CommandEmpty className="py-0">
                <div className="flex flex-col items-start gap-2 p-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-sm text-blue-500 hover:text-blue-700"
                  >
                    新規作成：{search}
                  </Button>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {tags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    onSelect={() => handleSelect(tag)}
                    className={`cursor-pointer disabled:opacity-50`}
                    disabled={!!selectedTags.find((t) => t.id === tag.id)}
                  >
                    <div
                      style={{ backgroundColor: tag.color }}
                      className="rounded-full px-2 py-1 text-xs mix-blend-difference"
                    >
                      {tag.name}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};
