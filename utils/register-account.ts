import { v4 } from 'uuid';
import Crypto from './encryption';
import CalendarStateEntity, {
  CalendarBodyToSend,
} from '../../data/entities/state/calendar.entity';
import OpenPgp, { PgpKeys } from './OpenPgp';
import { getLocalTimezone } from './common';

const DEFAULT_CALENDAR_NAME = 'My calendar';
const DEFAULT_CALENDAR_COLOR = {
  name: 'indigo',
  light: '#9fa8da',
  dark: '#3949ab',
};

const DEFAULT_CALENDAR_DATA: any = {
  name: DEFAULT_CALENDAR_NAME,
  color: 'indigo',
  reminders: [],
  timezone: getLocalTimezone(),
};

export default async (
  username: string,
  password: string,
  salt: string,
  verifier: string,
  isDemo: boolean = false
): Promise<any> => {
  // Process registration

  // Create new default objects
  const defaultCalendar: CalendarStateEntity = new CalendarStateEntity(
    DEFAULT_CALENDAR_DATA
  );

  // Generate new PGP keys
  const pgpKeys: PgpKeys = await OpenPgp.generateKeys(username, password);
  const { publicKey, privateKey } = pgpKeys;

  const encryptedCalendar: CalendarBodyToSend = await defaultCalendar.formatBodyToSendPgp(
    publicKey
  );

  // Encrypted privateKey
  const encryptedPrivateKeyPassword: string = await Crypto.encrypt(
    privateKey,
    password
  );

  // Create objects for server

  // Prepare data
  const data = {
    username,
    salt,
    verifier,
    calendar: encryptedCalendar,
    publicKey,
    privateKey: encryptedPrivateKeyPassword,
    isDemo,
  };

  return {
    data,
    pgpKeys,
  };
};
