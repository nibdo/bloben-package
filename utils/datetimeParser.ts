import { DateTime } from 'luxon';

//
// Support for local datetime, timezones and floating times
//
const FLOATING_DATETIME: string = 'floating'; // fixed datetime without timezone
const UTC_TIMEZONE: string = 'UTC';

/**
 * Parse datetime according different rules like local datetime, floating time and timezones
 * @param date
 * @param zone
 * @param deviceTimezone
 * @constructor
 */
export const DatetimeParser = (
  date: DateTime | string,
  zone: string,
  deviceTimezone?: string
): string => {
  const dateString: string = typeof date === 'string' ? date : date.toString();

  const isFloatingDatetime: boolean = zone === FLOATING_DATETIME;

  // Adjust date with timezone so when converted to UTC it represents correct value with fixed time
  if (isFloatingDatetime) {
    const dateFloating: DateTime = DateTime.fromISO(dateString, {
      zone: UTC_TIMEZONE,
    });

    return dateFloating.toUTC().toISO();
  }

  const thisDate: DateTime = DateTime.fromISO(dateString);

  // Adjust datetime to device timezone
  if (deviceTimezone) {
    const dateConvert: DateTime = thisDate.setZone(zone);

    return dateConvert.setZone(deviceTimezone).toString();
  }

  return thisDate.toString();
};

export const parseToDateTime = (
    date: DateTime | string,
    zone: string,
    deviceTimezone?: string,
): DateTime => {
  const dateString: string = typeof date === 'string' ? date : date.toString();

  const isFloatingDatetime: boolean = zone === FLOATING_DATETIME;

  // Adjust date with timezone so when converted to UTC it represents correct value with fixed time
  if (isFloatingDatetime) {
    const dateFloating: DateTime = DateTime.fromISO(dateString, {
      zone: UTC_TIMEZONE,
    });

    return dateFloating.toUTC();
  }

  const thisDate: DateTime = DateTime.fromISO(dateString);

  // Adjust datetime to device timezone
  if (deviceTimezone) {
    return thisDate.setZone(zone).setZone(deviceTimezone)
  }

  return thisDate;
};
