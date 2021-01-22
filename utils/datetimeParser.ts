import { utcToZonedTime } from 'date-fns-tz';
import { parseISO } from 'date-fns';
import { DateTime } from "luxon";

//
// Support for local datetime, timezones and floating times
//

const LOCAL_DATETIME: string = 'device'; // local timezone of user's device
const FLOATING_DATETIME: string = 'floating'; // fixed datetime without timezone
const UTC_TIMEZONE: string = 'UTC';

/**
 * Parse datetime according different rules like local datetime, floating time and timezones
 * @param date
 * @param zone
 * @constructor
 */
export const DatetimeParser = (date: DateTime | string, zone: string): string => {
  const dateString: string = typeof date === 'string' ? date : date.toString();
  const thisDate: DateTime = DateTime.fromISO(dateString);

  const isFloatingDatetime: boolean = zone === FLOATING_DATETIME;
  const isLocalDatetime: boolean = zone === LOCAL_DATETIME;

  // No change as browser auto adjust current timezone
  if (isLocalDatetime) {
    return thisDate.toString();
  }

  // Adjust date with timezone so when converted to UTC it represents correct value
  // Technically time will be not correct, but user wants it fixed
  // Javascript will convert it to local timezone but with actual utc value
  if (isFloatingDatetime) {
    const dateFloating: DateTime = DateTime.fromISO(dateString, {
      zone: UTC_TIMEZONE
    });

    console.log('dateFloating', dateFloating.toString())

    return dateFloating.toString();
  }

  return thisDate.toString();
};
