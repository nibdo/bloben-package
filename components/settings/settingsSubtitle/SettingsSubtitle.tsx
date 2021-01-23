import React, { useContext } from 'react';

import './SettingsSubtitle.scss';
import { parseCssDark } from '../../../../bloben-common/utils/common';
import { Context } from '../../../context/store';

interface ISettingsSubtitleProps {
    text: string;
}
const SettingsSubtitle = (props: ISettingsSubtitleProps) => {
    const { text } = props;

    const [store] = useContext(Context);
    const { isDark } = store;

    return (
        <div className={'settings-subtitle__container'}>
            <p className={parseCssDark('settings-subtitle__text', isDark)}>
                {text}
            </p>
        </div>
    );
};

export default SettingsSubtitle;
