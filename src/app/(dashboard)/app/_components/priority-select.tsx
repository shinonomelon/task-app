'use client';

import { useState } from 'react';

import { Priority } from '@/types/task';

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
  { value: 'high', label: '高い' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低い' }
];

export const PrioritySelect = ({
  defaultValue = 'low'
}: {
  defaultValue?: Priority;
}) => {
  const [priority, setPriority] = useState<Priority>(defaultValue);

  const handleChange = (value: Priority) => {
    setPriority(value);
  };

  return (
    <Select value={priority} name="priority" onValueChange={handleChange}>
      <SelectTrigger className="w-full font-normal" aria-label="優先度を選択">
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
