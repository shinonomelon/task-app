'use client';

import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';

interface TaskSectionProps {
  title: string;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function TaskSection({
  title,
  count,
  children,
  defaultOpen = true
}: TaskSectionProps) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="space-y-2">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start p-2 font-normal"
        >
          <ChevronDown className="collapsible-closed:-rotate-90 size-4 shrink-0 transition-transform duration-200" />
          <span className="ml-2">{title}</span>
          <span className="ml-2 text-muted-foreground">{count}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">{children}</CollapsibleContent>
    </Collapsible>
  );
}
