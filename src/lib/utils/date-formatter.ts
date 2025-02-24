import { format, isSameYear, isToday, isTomorrow, isYesterday } from 'date-fns';
import { ja } from 'date-fns/locale';

export const formatDate = {
  toLocalDateString: (date: Date) => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  },

  toDisplayDate: (date: Date, includeTime = false) => {
    if (isToday(date)) {
      let label = '今日';
      if (includeTime) {
        label += ` ${format(date, 'HH:mm')}`;
      }
      return label;
    }

    if (isTomorrow(date)) return '明日';
    if (isYesterday(date)) return '昨日';
    if (isSameYear(date, new Date())) {
      return format(date, 'M月dd日', { locale: ja });
    }
    return format(date, 'yyyy年M月dd日', { locale: ja });
  }
};
