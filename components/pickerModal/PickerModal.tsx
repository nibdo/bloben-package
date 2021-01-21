import React, { useContext, useState } from 'react';
import { ButtonBase } from '@material-ui/core';
import {
  format,
  getDate,
  getHours,
  getMinutes,
  getMonth,
  getYear,
} from 'date-fns';
import BottomSheet from 'bottom-sheet-react';

import DatePicker from '../datePicker/DatePicker';
import TimePicker from '../timePicker/TimePicker';
import { HeightHook, WidthHook } from 'bloben-common/utils/layout';
import { Context } from '../../context/store';

interface IPickerModalViewProps {
  selectedDate: any;
  setDate: any;
  setTime: any;
  handleCloseModal: any;
  setDatePickerVisible: any;
  datePickerIsVisible: boolean;
  dateOnly: boolean;
}
const PickerModalView = (props: IPickerModalViewProps) => {
  const {
    selectedDate,
    setDate,
    setTime,
    handleCloseModal,
    setDatePickerVisible,
    datePickerIsVisible,
    dateOnly,
  } = props;

  const [store] = useContext(Context);

  const {isDark} = store;

  const width: number = WidthHook();
  const height: number = HeightHook();

  return (
    <BottomSheet
        backdropClassName={isDark ? 'bottom-sheet__backdrop--dark' : ''}
        containerClassName={isDark ? 'bottom-sheet__container--dark' : ''}
      isExpandable={false}
      customHeight={(height / 4) * (dateOnly ? 2 : 3)}
      onClose={handleCloseModal}
    >
      <div className={'picker__wrapper'}>
        {!dateOnly ? (
          <div className={'picker__row'}>
            <ButtonBase
              onClick={() => setDatePickerVisible(true)}
              className={`picker__button${
                datePickerIsVisible ? '--selected' : ''
              }`}
            >
              Date
            </ButtonBase>
            <ButtonBase
              onClick={() => setDatePickerVisible(false)}
              className={`picker__button${
                datePickerIsVisible ? '' : '--selected'
              }`}
            >
              Time
            </ButtonBase>
          </div>
        ) : null}
        {!dateOnly ? (
          <ButtonBase className={'edit-task__reminder-button'}>
            <p className={'date-picker__date-selected'}>
              {!selectedDate ? 'Date not selected' : ''}
            </p>
            <p className={'date-picker__date-selected'}>
              {selectedDate
                ? format(new Date(selectedDate), 'dd. MM. yyyy, HH:mm')
                : ''}
            </p>
          </ButtonBase>
        ) : null}
        <div className={'picker__container'}>
          {datePickerIsVisible ? (
            <DatePicker
                keyPrefix={'pickerModal'}
              width={width - 48}
              sideMargin={24}
              height={(height / 6) * 4}
              selectDate={setDate}
              selectedDate={selectedDate}
            />
          ) : (
            <TimePicker selectTime={setTime} selectedDate={selectedDate} />
          )}
        </div>
      </div>
    </BottomSheet>
  );
};

interface IPickerModalProps {
  selectedDate: any;
  handleCloseModal: any;
  dateOnly: boolean;
  selectDate: any;
}
const PickerModal = (props: IPickerModalProps) => {
  const [datePickerIsVisible, setDatePickerVisible] = useState(true);
  const {
    selectedDate,
    selectDate,
    handleCloseModal,
    dateOnly,
  } = props;

  const setDate = (date: any) => {
    if (!selectedDate) {
      selectDate(
        new Date(
          getYear(date),
          getMonth(date),
          getDate(date),
          getHours(new Date())
        )
      );

      return;
    }
    // If there is reminder set, preserve time from it
    const dateTime: any = new Date(
      getYear(date),
      getMonth(date),
      getDate(date),
      getHours(new Date(selectedDate)),
      getMinutes(new Date(selectedDate))
    );
    selectDate(dateTime);
  };

  const setTime = (date: any) => {
    if (!selectedDate) {
      selectDate(
        new Date(
          getYear(new Date()),
          getMonth(new Date()),
          getDate(new Date()),
          getHours(date)
        )
      );

      return;
    }
    // If there is reminder set, preserve time from it
    selectDate(date);
  };

  return (
    <PickerModalView
      dateOnly={dateOnly}
      selectedDate={selectedDate}
      setDate={setDate}
      setTime={setTime}
      handleCloseModal={handleCloseModal}
      setDatePickerVisible={setDatePickerVisible}
      datePickerIsVisible={datePickerIsVisible}
    />
  );
};

export default PickerModal;
