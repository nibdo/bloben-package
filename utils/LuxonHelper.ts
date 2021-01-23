import { DateTime } from 'luxon';

const LuxonHelper = {
  parseToDateTime: (date: string | DateTime): DateTime =>
      typeof date === 'string' ? DateTime.fromISO(date) : date,

  getLastDayOfMonth: (date: DateTime): DateTime => {
    const daysInMonth: number = date.daysInMonth;

    return date.set({ day: daysInMonth });
  },

  getFirstDayOfMonth: (date: DateTime): DateTime => date.set({ day: 1 }),

  isSameDay: (dateA: DateTime | string, dateB: DateTime | string): boolean => {
    const dateAParsed: DateTime = LuxonHelper.parseToDateTime(dateA);
    const dateBParsed: DateTime = LuxonHelper.parseToDateTime(dateB);

    return dateAParsed.year === dateBParsed.year &&
        dateAParsed.month === dateBParsed.month &&
        dateAParsed.day === dateBParsed.day
  },

  isBefore: (dateA: string, dateB: string): boolean =>
      DateTime.fromISO(dateB).millisecond - DateTime.fromISO(dateA).millisecond > 0,

  isToday: (dateA: DateTime): boolean =>
    dateA.hasSame(DateTime.local(), "day"),

  toUtcString: (date: string): string =>
      DateTime.fromISO(date).toUTC().toISO(),
  toUtc: (date: DateTime): string =>
     date.toUTC().toISO()
};

export default LuxonHelper;
