'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils/cn';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const setDeadlineToEndOfDayLocal = (date: Date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  );
};

const combineDateAndTime = (date: Date, timeStr: string) => {
  const [hour, minute] = timeStr.split(':').map(Number);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hour,
    minute,
    0,
    0
  );
};

export const DatePicker = ({
  defaultValue
}: {
  defaultValue?: string | null;
}) => {
  const pathname = usePathname();
  const isTodayPage = pathname === '/app/today';

  const [date, setDate] = useState<Date | undefined>(undefined);

  const [time, setTime] = useState<string>('12:00');

  const handleTimeChange = (value: string) => {
    setTime(value);
  };

  const [includeTime, setincludeTime] = useState<boolean>(false);

  useEffect(() => {
    if (defaultValue) {
      const defaultDate = new Date(defaultValue);
      setDate(defaultDate);
      const endOfDay = setDeadlineToEndOfDayLocal(defaultDate);

      if (defaultDate.getTime() === endOfDay.getTime()) {
        setincludeTime(false);
      } else {
        setincludeTime(true);
        const hours = defaultDate.getHours().toString().padStart(2, '0');
        const minutes = defaultDate.getMinutes().toString().padStart(2, '0');
        setTime(`${hours}:${minutes}`);
      }
    } else if (isTodayPage) {
      setDate(new Date());
    }
  }, [isTodayPage, defaultValue]);

  let deadlineDate: Date | null = null;
  if (date) {
    deadlineDate = includeTime
      ? combineDateAndTime(date, time)
      : setDeadlineToEndOfDayLocal(date);
  }
  const deadlineValue = deadlineDate ? deadlineDate.toISOString() : '';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
              aria-label="日付を選択"
            >
              <CalendarIcon />
              {date ? (
                <>
                  {format(date, 'yyyy年M月dd日', { locale: ja })}
                  {includeTime && ` ${time}`}
                </>
              ) : (
                <span>期限</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto px-0 py-3" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
            <div className="border-t">
              <div
                role="button"
                onClick={() => setincludeTime((prev) => !prev)}
                className="flex cursor-pointer items-center justify-between px-3 pt-3"
              >
                <div className="flex-1">時間を含む</div>
                <div className="shrink-0">
                  <Switch
                    checked={includeTime}
                    onCheckedChange={(checked) => setincludeTime(!checked)}
                  />
                </div>
              </div>
              {includeTime && (
                <div className="p-3">
                  <Select onValueChange={handleTimeChange} value={time}>
                    <SelectTrigger>
                      <SelectValue placeholder="時間を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 48 }, (_, i) => ({
                        hour: Math.floor(i / 2),
                        minute: i % 2 === 0 ? '00' : '30'
                      })).map(({ hour, minute }) => (
                        <SelectItem
                          key={`${hour}-${minute}`}
                          value={`${hour.toString().padStart(2, '0')}:${minute}`}
                        >
                          {`${hour.toString().padStart(2, '0')}:${minute}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <input type="hidden" name="deadline" value={deadlineValue} />
      <input type="hidden" name="include_time" value={includeTime.toString()} />
    </div>
  );
};
