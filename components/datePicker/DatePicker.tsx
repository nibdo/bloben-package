import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  addDays,
  getDay,
  getMonth,
  getYear,
  subDays,
  addMonths,
  parseISO,
  getDate,
  isSameDay,
  isSameMonth,
  subMonths,
} from 'date-fns';

import './DatePicker.scss';
import { WidthHook } from 'bloben-common/utils/layout';
import { ButtonBase, IconButton } from '@material-ui/core';
import EvaIcons from 'bloben-common/components/eva-icons';

const parseMonths = (monthNum: number): string => {
  switch (monthNum) {
    case 0:
      return 'January';
    case 1:
      return 'February';
    case 2:
      return 'March';
    case 3:
      return 'April';
    case 4:
      return 'May';
    case 5:
      return 'June';
    case 6:
      return 'July';
    case 7:
      return 'August';
    case 8:
      return 'September';
    case 9:
      return 'October';
    case 10:
      return 'November';
    case 11:
      return 'December';
    default:
      return '';
  }
};

const renderDays = (
  data: any,
  width: number,
  sideMargin: number = 0,
  selectDate: any,
  selectedDate: any,
  monthDayRef: any
) =>
  data.map((item: any) => (
    <OneDay
      item={item}
      width={width}
      sideMargin={sideMargin}
      selectDate={selectDate}
      selectedDate={selectedDate}
      monthDayRef={monthDayRef}
    />
  ));

interface IOneDayProps {
  item: any;
  width: number;
  sideMargin: number;
  selectDate: any;
  selectedDate: Date;
  monthDayRef: any;
}
const OneDay = (props: IOneDayProps) => {
  const {
    item,
    width,
    sideMargin,
    selectDate,
    selectedDate,
    monthDayRef,
  } = props;

  const oneSide: number = (width - sideMargin - sideMargin) / 7;

  const oneDayStyle: any = {
    width: `${oneSide}px`,
    height: `${oneSide}px`,
    borderRadius: `${oneSide / 2}px`,
  };

  const isSameMonthValue: boolean = isSameMonth(item, monthDayRef);
  const isSelectedDate: boolean = isSameDay(item, new Date(selectedDate));

  return (
    <ButtonBase
      onClick={() => selectDate(item)}
      className={`date-picker__one-day-container${
        isSelectedDate ? '--selected' : null
      }`}
      style={oneDayStyle}
    >
      <p
        className={`date-picker__one-day-text${
          isSameMonthValue ? '-normal' : ''
        }${isSelectedDate ? '-selected' : ''}`}
      >
        {getDate(item)}
      </p>
    </ButtonBase>
  );
};

interface IMonthProps {
  data: any;
  width: number;
  sideMargin: number;
  selectDate: any;
  selectedDate: Date;
  addOneMonth: any;
  subOneMonth: any;
}
const Month = (props: IMonthProps) => {
  const {
    data,
    width,
    sideMargin,
    selectDate,
    selectedDate,
    addOneMonth,
    subOneMonth,
  } = props;

  const monthDayRef: any = data[14];
  const isDark: boolean = useSelector((state: any) => state.isDark);

  const days = renderDays(
    data,
    width,
    sideMargin,
    selectDate,
    selectedDate,
    monthDayRef
  );

  const monthTitle: string = parseMonths(getMonth(monthDayRef));

  const containerStyle: any = {
    width: width - sideMargin * 2,
    marginLeft: sideMargin,
    marginRight: sideMargin,
  };

  return (
    <div className={'date-picker__container-month'} style={containerStyle}>
      <div className={'date-picker__row'}>
        <h6 className={'date-picker__title-month'}>{monthTitle}</h6>
        <IconButton onClick={subOneMonth}>
          <EvaIcons.ChevronLeft
            className={`icon-svg${isDark ? '-dark' : ''}`}
          />
        </IconButton>
        <IconButton onClick={addOneMonth}>
          <EvaIcons.ChevronRight
            className={`icon-svg${isDark ? '-dark' : ''}`}
          />
        </IconButton>
      </div>
      {days}
    </div>
  );
};

interface IDatePickerViewProps {
  data: any;
  width: number;
  sideMargin: number;
  selectDate: any;
  selectedDate: Date;
  addOneMonth: any;
  subOneMonth: any;
  handleScroll: any;
}
const DatePickerView = (props: IDatePickerViewProps) => {
  const {
    width,
    sideMargin,
    handleScroll,
    data,
    selectDate,
    selectedDate,
    addOneMonth,
    subOneMonth,
  } = props;

  return (
    <div
      className={'date-picker__wrapper'}
      id={'date-picker'}
      onScroll={handleScroll}
    >
      <Month
        data={data}
        width={width}
        sideMargin={sideMargin}
        selectDate={selectDate}
        selectedDate={selectedDate}
        addOneMonth={addOneMonth}
        subOneMonth={subOneMonth}
      />
    </div>
  );
};

const getOneMonth = (date: any) => {
  let rectCount = 0;
  const parsedDate: any = date;
  let dayInWeek: any = getDay(
    // @ts-ignore
    new Date(getYear(parsedDate), getMonth(parsedDate), 1)
  );
  // @ts-ignore
  const firstDayInMonth: any =
    // @ts-ignore
    new Date(getYear(parsedDate), getMonth(parsedDate), 1);
  const monthDays: any = [];
  if (dayInWeek === 0) {
    dayInWeek = 7;
  }
  //Find days for first week at the beginning of month
  // @ts-ignore
  for (let i = dayInWeek - 1; i >= 0; i--) {
    monthDays.push(subDays(firstDayInMonth, i));
    rectCount += 1;
  }
  // @ts-ignore
  for (let i = 1; i < 8 - dayInWeek; i++) {
    monthDays.push(addDays(firstDayInMonth, i));
    rectCount += 1;
  }
  //Three weeks in middle
  for (let i = 8 - dayInWeek; rectCount < 42; i++) {
    monthDays.push(addDays(firstDayInMonth, i));
    rectCount += 1;
  }

  return monthDays;
};

interface IDatePickerProps {
  data?: any;
  width: number;
  sideMargin: number;
  selectDate: any;
  selectedDate: Date;
  addOneMonth?: any;
  subOneMonth?: any;
  handleScroll?: any;
  height?: number;
}
const DatePicker = (props: IDatePickerProps) => {
  const { selectDate, selectedDate, width, sideMargin } = props;
  const widthFromHook: number = WidthHook();

  const [months, setMonths]: any = useState([]);

  const getDaysInMonthInit = (date: any) => {
    const initMonths: any = getOneMonth(parseISO(date));

    setMonths(initMonths);
  };

  const addOneMonth = () => {
    const newMonth: any = getOneMonth(addMonths(months[14], 1));
    setMonths(newMonth);
  };
  const subOneMonth = () => {
    const newMonth: any = getOneMonth(subMonths(months[14], 1));
    setMonths(newMonth);
  };

  useEffect(() => {
    if (!selectedDate) {
      const dateNow: any = JSON.parse(JSON.stringify(new Date()));
      // selectDate(dateNow);
      // @ts-ignore
      getDaysInMonthInit(dateNow);
    } else {
      const dateNow: any = JSON.parse(JSON.stringify(selectedDate));
      getDaysInMonthInit(dateNow);
    }
  }, []);

  const handleScroll = (e: any) => {
    if (e.target.scrollTop > 0) {
    } else {
    }
    const element: any = document.getElementById('date-picker');
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      // element is at the end of its scroll, load more content
    }
  };

  return (
    <DatePickerView
      handleScroll={handleScroll}
      width={width ? width : widthFromHook}
      sideMargin={sideMargin}
      data={months}
      selectDate={selectDate}
      selectedDate={selectedDate}
      addOneMonth={addOneMonth}
      subOneMonth={subOneMonth}
    />
  );
};

export default DatePicker;
