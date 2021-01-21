import { format, parseISO } from 'date-fns';

export const TIMESTAMP_FORMAT = "yyyy-MM-dd HH:mm:ss 'Z'";
export const DATE_HOUR_FORMAT = 'd. MMM, HH:mm';
export const DATE_FORMAT = 'd. MMMM';
export const TIME_FORMAT = 'HH:mm';
export const DATE_DAY_FORMAT = 'd. MMMM (EEEEEE)';
export const WEEK_DAY_FORMAT = 'cccc';
export const WEEK_DAY_FORMAT_MEDIUM = 'ccc';
export const WEEK_DAY_FORMAT_SHORT = 'EEEEEE';
export const DATE_MONTH_YEAR_FORMAT = 'd. MMMM yyyy';

export const getStringDate = (date: any) => {
  return JSON.parse(JSON.stringify(date));
};

export const formatDate = (date: any, formatString: string): string => {
  return format(new Date(date), formatString);
};

export const formatDateOnly = (date: any): string => {
  return format(new Date(date), 'd. MMMM');
};
export const formatTimeOnly = (date: any): string => {
  return format(new Date(date), 'HH:mm');
};

export const parse = (date: any) => {
  //TODO: Clean and add parse back to ISO
  // const formatedDate = format(new Date(date), "yyyy-MM-dd HH:mm:ss zzzzzz'Z'");
  //const formatedDate = formatISO(date);
  return parseISO(date);
};


