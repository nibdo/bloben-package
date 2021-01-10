import React from 'react';
import { useSelector } from 'react-redux';
import { parseCssDark } from 'bloben-common/utils/common';

interface IHeaderCalendarTitleProps {
    title?: string;
    animation?: string;
}

/**
 * Calendar title in header in month date format
 * @param props
 * @constructor
 */
const HeaderCalendarTitle = (props: IHeaderCalendarTitleProps) => {
    const {title, animation} = props;

    const isDark: boolean = useSelector((state: any) => state.isDark);

    return   <div className={`header__title-button ${animation}`}>
        <p className={parseCssDark('header__title', isDark)}>
            {title}
        </p>
    </div>
}

export default HeaderCalendarTitle;
