import { IEventState } from '../../bloben-utils/models/event.entity';
import ICalParser from '../../ical-js-parser/src/index';
import { DateTime } from 'luxon';
import LuxonHelper from '../../bloben-utils/utils/LuxonHelper';
import Contact from '../../bloben-utils/models/Contact';

export const ROLE_REQ: string = 'REQ-PARTICIPANT';
export const ROLE_OPT: string = 'OPT-PARTICIPANT';

export interface IAttendee {
    cn: string;
    role: string;
    rsvp: boolean;
    partstat: string;
    mailto: string;
}

export class Attendee {
    cn: string;
    role: string;
    rsvp: boolean;
    partstat: string;
    mailto: string;

    constructor(item: any) {
        const {name, email} = item;

        this.cn = name ? name : email;
        this.role = ROLE_REQ;
        this.rsvp = true;
        this.partstat = 'NEEDS-ACTION';
        this.mailto = email;
    }
}

export const createAttendee = (item: Contact) => {
    return {
        // 'x-id': v4(),
        cn: item.email,
        // cutype: 'INDIVIDUAL',
        role: 'REQ-PARTICIPANT',
        partstat: 'NEEDS-ACTION',
        rsvp: 'TRUE',
        // 'x-num-guests': 0,
        mailto: item.email,
    };
}
class ICalHelper {
    dtstart: any;
    dtend: any;
    dtstamp?: string;
    organizer?: any;
    uid?: string;
    attendee?: any;
    created?: string;
    description?: string;
    lastModified?: string;
    location?: string;
    sequence?: string;
    status?: string;
    summary?: string;
    transp?: string;
    rrule?: string;

    constructor(event: IEventState) {
        const {
            id,
            createdAt,
            updatedAt,
            startAt,
            endAt,
            summary,
            description,
            location,
            rRule,
            timezoneStart,
            organizer,
            attendees,
            externalId
        } = event;


        this.dtstart = {value: LuxonHelper.toUtcString(startAt), timezone: timezoneStart};
        this.dtend = {value: LuxonHelper.toUtcString(endAt), timezone: timezoneStart};
        this.uid = externalId ? externalId : `${id}@${process.env.REACT_APP_EMAIL_DOMAIN}`;
        this.organizer = organizer;
        this.attendee = attendees
        this.created = LuxonHelper.toUtcString(createdAt);
        this.dtstamp = DateTime.local().toUTC().toString();
        this.description = description;
        this.lastModified = LuxonHelper.toUtcString(updatedAt);
        this.rrule = rRule ? rRule : undefined;
        this.summary = summary;
        this.location = location;
        this.sequence = '0';
        this.status = 'CONFIRMED';
        this.transp = 'OPAQUE';
    }
    /**
     * Remove undefined props
     */
    private getKnownProps = () => {
        const result: any = {};
        // Strip any methods
        const clone: any = JSON.parse(JSON.stringify(this));

        for (const [key, value] of Object.entries(clone)) {
            if (value) {
                result[key] = value;
            }
        }

        return result;
    }

    private createCalendar = () => ({
        begin: 'BEGIN:VCALENDAR',
        prodid: 'BLOBEN 1.0',
        method: 'REQUEST',
        calscale: 'GREGORIAN',
        version: '2.0',
        end: 'END:VCALENDAR',
    });

    public parseTo = () => {
        const template: any = {
            calendar: this.createCalendar(),
            events: [this.getKnownProps()]
        }
        console.log('template', template)

        return ICalParser.parseTo(template);
    };

}

export default ICalHelper;
