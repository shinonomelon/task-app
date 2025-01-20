'use client';

import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const PRIORITY_OPTIONS = [
  { value: '3', label: '高い' },
  { value: '2', label: '中' },
  { value: '1', label: '低い' }
];

type Priority = '1' | '2' | '3';

export const PrioritySelect = () => {
  const [priority, setPriority] = useState<Priority>('1');

  const handleChange = (value: Priority) => {
    setPriority(value);
  };

  return (
    <Select value={priority} name="priority" onValueChange={handleChange}>
      <SelectTrigger className="w-fit" aria-label="優先度を選択">
        <SelectValue placeholder="優先度" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>優先度</SelectLabel>
          {PRIORITY_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
