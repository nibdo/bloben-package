import React, { useContext, useEffect, useState } from 'react';
import { ButtonBase } from '@material-ui/core';
import { useSelector } from 'react-redux';

import './TimeZonePicker.scss';
import { parseCssDark } from '../../../bloben-common/utils/common';
import { Context } from '../../context/store';
import ScrollView from '../../../bloben-common/components/scrollView/ScrollView';
import SearchHeader from '../searchHeader/SearchHeader';
import { getLocalTimezone, parseTimezoneTextWithOffset } from '../../utils/common';

interface IOneTimezoneProps {
  name: string;
  selectTimezone: any;
  isDark: boolean;
  handleClose: any;
  localTimezone?: string;
}
const OneTimezone = (props: IOneTimezoneProps) => {
  const { name, isDark, selectTimezone, handleClose, localTimezone } = props;

  const handleSelect = () => {
    selectTimezone(name)
    handleClose()
  }

  return <ButtonBase
      className={parseCssDark('timezone__container', isDark)}
      onClick={handleSelect}
    >
    <p className={parseCssDark('timezone__text', isDark)}>{parseTimezoneTextWithOffset(name, undefined, localTimezone)}</p>
  </ButtonBase>;
};

const renderResults = (data: string[], selectTimezone: any, handleClose: any, isDark: boolean, localTimezone?: string) =>
  data.map((item: string) => (
    <OneTimezone key={item} name={item} isDark={isDark} handleClose={handleClose} selectTimezone={selectTimezone} localTimezone={localTimezone}/>
  ));

interface ITimePickerViewProps {
  selectTimezone: any;
  onClose: any;
  handleClearSearch: any;
  onSearchInput: any;
  typedText: string;
  results: string[];
  localTimezone?: string;
}
const TimeZonePickerView = (props: ITimePickerViewProps) => {
  const [store] = useContext(Context);

  const { isMobile, isDark } = store;

  const {
    onClose,
    selectTimezone,
    results,
    handleClearSearch,
    onSearchInput,
    typedText,
    localTimezone
  } = props;

  const timezoneResults: any = renderResults(results, selectTimezone, onClose, isDark, localTimezone);

  return (
    <div className={parseCssDark('column', isDark)}>
      <SearchHeader
        typedText={typedText}
        goBack={onClose}
        handleClearSearch={handleClearSearch}
        onSearchInput={onSearchInput}
        placeholder={'Search timezones'}
      />
      <ScrollView isDark={isDark}>{timezoneResults}</ScrollView>
    </div>
  );
};

interface ITimeZonePickerProps {
  selectTimezone: any;
  onClose: any;
  floatDisabled?: boolean;
}

const TimeZonePicker = (props: ITimeZonePickerProps) => {
  const { selectTimezone, onClose, floatDisabled } = props;

  const localTimezone: string = getLocalTimezone()

  const DEFAULT_RESULT_SETTINGS: string[] = floatDisabled ? [localTimezone] : [localTimezone, 'floating'];

  const [typedText, setTypedText] = useState('');
  const [results, setResults]: any = useState(DEFAULT_RESULT_SETTINGS);



  const timezones: string[] = useSelector((state: any) => state.timezones);

  const onSearchInput = (event: any) => {
    setTypedText(event.target.value);
  };

  const handleClearSearch = () => {
    setTypedText('');
    setResults(DEFAULT_RESULT_SETTINGS);
  };

  useEffect(() => {
    if (typedText.length < 1) {
      setResults(DEFAULT_RESULT_SETTINGS);

      return;
    }
    const foundItems: any[] = search(typedText);

    setResults(foundItems);
  }, [typedText]);

  const search = (keyWord: string) => {
    const result: any = DEFAULT_RESULT_SETTINGS;

    if (keyWord.length >= 3) {
      for (const item of timezones) {
        if (item.toLowerCase().indexOf(keyWord.toLowerCase()) !== -1) {
          result.push(item);
        }
      }
    }

    return result;
  };

  return (
    <TimeZonePickerView
      onClose={onClose}
      selectTimezone={selectTimezone}
      handleClearSearch={handleClearSearch}
      onSearchInput={onSearchInput}
      typedText={typedText}
      results={results}
      localTimezone={localTimezone}
    />
  );
};

export default TimeZonePicker;
