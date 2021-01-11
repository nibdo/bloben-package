import React, { useContext, useEffect } from 'react';
import { getMonth, getYear, getDate, getHours, getMinutes } from 'date-fns';
import { ButtonBase } from '@material-ui/core';
import { useSelector } from 'react-redux';

import './TimePicker.scss';
import { WidthHook } from 'bloben-common/utils/layout';
import { parseCssDark } from '../../../bloben-common/utils/common';
import { Context } from '../../context/store';

const getHoursComponent = (selectedDate: any, selectHour: any, isDark: boolean) => {
  const hours: any[] = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i);
  }

  return hours.map((hour: any) => (
    <ButtonBase
      onClick={() => selectHour(hour)}
      id={`hour_${hour}`}
      className={parseCssDark(`time-picker__text${
        hour === getHours(selectedDate) ? '--selected' : ''
      }`, isDark)}
    >
      {hour}
    </ButtonBase>
  ));
};

const EmptyButton = () => (
  <ButtonBase disabled={true} className={'time-picker__text--hidden'}>
    00
  </ButtonBase>
);

const getMinutesComponent = (selectedDate: any, selectMinute: any, isDark: boolean) => {
  const minutes: any[] = [];
  for (let i = 0; i < 60; i = i + 1) {
    minutes.push(i);
  }

  return minutes.map((minute: any) => (
    <ButtonBase
      id={`minute_${minute}`}
      onClick={() => selectMinute(minute)}
      className={parseCssDark(`time-picker__text${
        minute === getMinutes(selectedDate) ? '--selected' : ''
      }`, isDark)}
    >
      {minute}
    </ButtonBase>
  ));
};

const SCROLL_ANIMATION: any = { behavior: 'smooth', block: 'center' };

interface ITimePickerViewProps {
  selectedDate: any;
  selectMinute: any;
  selectHour: any;
  width: number;
}
const TimePickerView = (props: ITimePickerViewProps) => {
  const { selectedDate, selectMinute, selectHour, width } = props;

  const [store] = useContext(Context);

  const {isMobile, isDark} = store;

  const scrollOffset: number = isMobile ? 34 : 140;

  //TODO Chrome bug for scroll into view, using only scroll to now

  const hours = getHoursComponent(selectedDate, selectHour, isDark);
  const minutes = getMinutesComponent(selectedDate, selectMinute, isDark);

  useEffect(() => {
    const hourNum: number = getHours(selectedDate);
    const hourEl: any = document.getElementById(`hour_${hourNum}`);
    const hourElement: any = document.querySelector(
      '.time-picker__container-hour'
    );
    hourElement.scrollTo({
      top: (hourNum + 2) * hourEl.clientHeight - scrollOffset,
      behavior: 'smooth',
      block: 'center',
    });
  }, []);
  useEffect(() => {
    const minuteNum: number = getMinutes(selectedDate);
    const minuteEl: any = document.getElementById(`minute_${minuteNum}`);
    const minuteElement: any = document.querySelector(
      '.time-picker__container-minute'
    );
    minuteElement.scrollTo({
      top: (minuteNum + 2) * minuteEl.clientHeight - scrollOffset,
      behavior: 'smooth',
      block: 'center',
    });
  }, []);

  const preventDefault = (e: any): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const containerStyle: any = {
    width,
  };

  return isMobile ? (
    <div
      className={'time-picker__wrapper'}
      id={'time-picker'}
      style={containerStyle}
      onClick={preventDefault}
    >
      <div className={'time-picker__container-hour'}>
        <EmptyButton />
        <EmptyButton />
        <EmptyButton />
        {hours}
        <EmptyButton />
        <EmptyButton />
        <EmptyButton />
      </div>
      <div className={parseCssDark('time-picker__separator', isDark)}>{':'}</div>
      <div className={'time-picker__container-minute'}>
        <EmptyButton />
        <EmptyButton />
        <EmptyButton />
        {minutes} <EmptyButton />
        <EmptyButton />
        <EmptyButton />
      </div>
    </div>
  ) : (
    <div
      className={'time-picker__wrapper'}
      id={'time-picker'}
      style={containerStyle}
      onClick={preventDefault}
    >
      <div className={'time-picker__container-hour'}>{hours}</div>
      <div className={'time-picker__container-minute'}>
        {minutes} <EmptyButton />
      </div>
    </div>
  );
};

interface ITimePickerProps {
  selectedDate: any;
  selectTime: any;
  width?: number;
}
const TimePicker = (props: ITimePickerProps) => {
  const { width, selectedDate, selectTime } = props;

  const widthFromHook: number = WidthHook();

  const isMobile: boolean = useSelector((state: any) => state.isMobile);

  const selectHour = (hour: any) => {
    const dateValue: any = selectedDate ? selectedDate : new Date();
    const newDate: any = new Date(
      getYear(dateValue),
      getMonth(dateValue),
      getDate(dateValue),
      hour,
      getMinutes(dateValue)
    );
    selectTime(newDate);
  };
  const selectMinute = (minute: any) => {
    const dateValue: any = selectedDate ? selectedDate : new Date();

    const newDate: any = new Date(
      getYear(dateValue),
      getMonth(dateValue),
      getDate(dateValue),
      getHours(dateValue),
      minute
    );
    selectTime(newDate);
  };

  return (
    <TimePickerView
      width={width && !isMobile ? width : widthFromHook}
      selectedDate={selectedDate}
      selectHour={selectHour}
      selectMinute={selectMinute}
    />
  );
};

export default TimePicker;
