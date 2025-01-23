'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

export const DatePicker = () => {
  const pathname = usePathname();
  const isTodayPage = pathname === '/app/today';

  const [date, setDate] = useState<Date | undefined>(
    isTodayPage ? new Date() : undefined
  );

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
            aria-label="日付を選択"
          >
            <CalendarIcon />
            {date ? (
              format(date, 'yyyy年MM月dd日', { locale: ja })
            ) : (
              <span>期限を選択</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
        <input
          type="hidden"
          name="deadline"
          value={date ? new Date(date).toISOString() : ''}
        />
      </Popover>
    </>
  );
};
