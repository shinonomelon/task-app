'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

const setDeadlineToEndOfDayUTC = (date: Date) => {
  const endOfDayUTC = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );
  return endOfDayUTC.toISOString();
};

export const DatePicker = ({
  defaultValue
}: {
  defaultValue?: string | null;
}) => {
  const pathname = usePathname();
  const isTodayPage = pathname === '/app/today';

  const [date, setDate] = useState<Date | undefined>(
    isTodayPage ? new Date() : undefined
  );

  useEffect(() => {
    if (isTodayPage) {
      setDate(new Date());
    }
    if (defaultValue) setDate(new Date(defaultValue));
  }, [isTodayPage, defaultValue]);

  const deadlineValue = date ? setDeadlineToEndOfDayUTC(date) : '';

  return (
    <>
      {isTodayPage ? (
        <div className="flex items-center space-x-2">
          <CalendarIcon />
          <span>{format(new Date(), 'yyyy年MM月dd日', { locale: ja })}</span>
          <input
            type="hidden"
            name="deadline"
            value={setDeadlineToEndOfDayUTC(new Date())}
          />
        </div>
      ) : (
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
                <span>期限</span>
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
          <input type="hidden" name="deadline" value={deadlineValue} />
        </Popover>
      )}
    </>
  );
};
