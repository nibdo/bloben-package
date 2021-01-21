import { ButtonBase } from '@material-ui/core';
import { parseCssDark } from '../../../bloben-common/utils/common';
import EvaIcons from '../../../bloben-common/components/eva-icons';
import React, { useContext } from 'react';
import { Context } from '../../context/store';
import { parseTimezoneText } from '../../utils/common';

interface ITimezoneRowProps {
    timezone: string;
    openTimezoneModal: any;
}
const TimezoneRow = (props: ITimezoneRowProps) => {
    const { timezone, openTimezoneModal } = props;

    const [store] = useContext(Context);
    const { isDark } = store;

    return (
        <ButtonBase className={parseCssDark('event_detail__row', isDark)} onClick={openTimezoneModal}>
            <div className={'event_detail__container--icon'}>
                <EvaIcons.Globe
                    className={'svg-icon event-content-svg'}
                />
            </div>
            <p className={parseCssDark('event_detail__input', isDark)}>
                {parseTimezoneText(timezone)}
            </p>
        </ButtonBase>
    );
};

export default TimezoneRow;
