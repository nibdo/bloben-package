import React, { useContext, useState } from 'react';
import './Dropdown.scss';
import EvaIcons from 'bloben-common/components/eva-icons';
import {  ButtonBase } from '@material-ui/core';
import { useHistory } from 'react-router';
import { capitalStart } from '../../utils/common';
import { isArray } from 'util';
import { HeightHook } from 'bloben-common/utils/layout';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../utils/logout';
import { parseCssDark } from '../../../bloben-common/utils/common';
import { Context } from '../../context/store';

interface IDropdownCheckboxItemProps {
  selectedValue: any;
  value: any;
  handleClick: any;
}
const DropdownCheckboxItem = (props: IDropdownCheckboxItemProps) => {
  const { selectedValue, value, handleClick } = props;

  const isSelected: boolean = selectedValue === value;
  const [store] = useContext(Context);

  const {isDark} = store;

  return (
    <ButtonBase
      className={`dropdown__item-container`}
      onClick={() => handleClick(value)}
    >
      {isSelected ? (
        <EvaIcons.Check
          className={`svg-icon dropdown__icon-selected${isDark ? '-dark' : ''}`}
        />
      ) : (
        <EvaIcons.Check
          className={`svg-icon dropdown__icon${isDark ? '-dark' : ''}`}
        />
      )}
      <p className={`dropdown__item-text${isDark ? '-dark' : ''}`}>{value}</p>
    </ButtonBase>
  );
};

interface IDropdownItemProps {
  selectedValue: any;
  value: any;
  handleClick: any;
}
const DropdownItem = (props: IDropdownItemProps) => {
  const { selectedValue, value, handleClick } = props;

  const isSelected: boolean = isArray(selectedValue)
    ? value.indexOf(selectedValue) !== -1
    : selectedValue === value;
  const [store] = useContext(Context);

  const {isDark} = store;

  return (
    <ButtonBase
      className={`dropdown__item-container`}
      onClick={() => handleClick(value)}
    >
      {isSelected ? (
        <EvaIcons.RadioOn
          className={`svg-icon dropdown__icon-selected${isDark ? '-dark' : ''}`}
        />
      ) : (
        <EvaIcons.RadioOff
          className={`svg-icon dropdown__icon${isDark ? '-dark' : ''}`}
        />
      )}
      <p className={`dropdown__item-text${isDark ? '-dark' : ''}`}>
        {capitalStart(value)}
      </p>
    </ButtonBase>
  );
};

interface IDropdownItemSimpleProps {
  value: any;
  handleClick: any;
}
const DropdownItemSimple = (props: IDropdownItemSimpleProps) => {
  const { value, handleClick } = props;

  const [store] = useContext(Context);

  const {isDark} = store;

  return (
    <ButtonBase
      className={`dropdown__item-container`}
      onClick={() => handleClick(value)}
    >
      <p className={parseCssDark('dropdown__item-text', isDark)}>
        {capitalStart(value)}
      </p>
    </ButtonBase>
  );
};
const renderCheckboxItems = (
  data: any[],
  selectedValue: string,
  handleClick: any
) => {
  return data.map((item: any) => {
    return (
      <DropdownCheckboxItem
        key={item.id}
        value={item.name}
        selectedValue={selectedValue.indexOf(item.id) !== -1}
        handleClick={handleClick}
      />
    );
  });
};
const renderItems = (data: any[], selectedValue: string, handleClick: any) => {
  return data.map((item: any) => {
    return (
      <DropdownItem
        key={item}
        value={item}
        selectedValue={selectedValue}
        handleClick={handleClick}
      />
    );
  });
};
const renderSimpleItems = (
  data: any[],
  selectedValue: string,
  handleClick: any
) => {
  return data.map((item: any) => {
    return (
      <DropdownItemSimple
        key={item}
        value={item}
        handleClick={handleClick}
      />
    );
  });
};

/**
 * Get dropdown items based on type
 */
const getDropdownType = (
  type: string | undefined,
  values: any,
  selectedValue: any,
  handleClick: any,
  variant?: string
) => {
  if (!type) {
    return renderItems(values, selectedValue, handleClick);
  }

  if (type === 'checkbox') {
    return renderCheckboxItems(values, selectedValue, handleClick);
  }

  if (variant === 'simple') {
    return renderSimpleItems(values, selectedValue, handleClick);
  }
};

interface IDropdownViewProps {
  type?: string;
  isOpen: any;
  values: any;
  selectedValue: any;
  handleClick: any;
  preventDefault: any;
  closeDropdown: any;
  children: any;
  variant?: string;
}
const DropdownView = (props: IDropdownViewProps) => {
  const {
    type,
    isOpen,
    values,
    selectedValue,
    handleClick,
    preventDefault,
    closeDropdown,
    children,
    variant,
  } = props;

  const { clientX, clientY } = isOpen;

  const height: number = HeightHook();
  const [store] = useContext(Context);

  const {isDark} = store;

  const dropdownStyle = {
    top: clientY ? height - clientY < 150 ? `0px` : '100px' : '',
    left: clientX ? `${clientX}px` : '',
  };

  const items: any = getDropdownType(
    type,
    values,
    selectedValue,
    handleClick,
    variant
  );

  return (
    <div className={'dropdown__anchor'}>
      <div className={'dropdown__wrapper'} onClick={closeDropdown} />
      <div
        className={parseCssDark('dropdown__container', isDark)}
        id={'dropdown'}
        onClick={preventDefault}
        style={dropdownStyle}
      >
        {children ? children : items}
      </div>
    </div>
  );
};

interface IDropdownDesktopViewProps {
  closeDropdown: any;
  preventDefault: any;
}
const DropdownDesktopView = (props: IDropdownDesktopViewProps) => {
  const {
    closeDropdown,
    preventDefault,
  } = props;

  const isDark: boolean = useSelector((state: any) => state.isDark);
  const username: string = useSelector((state: any) => state.username);

  const history = useHistory();
  const dispatch: any = useDispatch();

  const navigateToSettings = (e: any) => {
    closeDropdown(e);
    history.push('/settings');
  };

  const handleLogout = (e: any) => {
    closeDropdown(e);
    logOut(dispatch);
  };

  const handleImportClick = (e: any) => {
    closeDropdown(e);
    history.push('/calendar/events/import');
  };

  return (
    <div className={'dropdown__anchor'}>
      <div className={'dropdown__wrapper'} onClick={closeDropdown} />
      <div
        className={`dropdown__container${isDark ? '-dark' : ''}`}
        onClick={preventDefault}
        style={{ top: 15, right: -5, overflow: 'hidden' }}
        // style={dropdownStyle}
      >
        <p className={'dropdown__text-bold'}>{username}</p>
        <ButtonBase
          className={'calendar-settings__item-container'}
          onClick={handleImportClick}
        >
          <p className={`calendar-settings__item-text${isDark ? '-dark' : ''}`}>
            Import events
          </p>
        </ButtonBase>
        <ButtonBase
          className={'calendar-settings__item-container'}
          onClick={navigateToSettings}
        >
          <p className={`calendar-settings__item-text${isDark ? '-dark' : ''}`}>
            Settings
          </p>
        </ButtonBase>
        <ButtonBase className={'dropdown__button'} onClick={handleLogout}>
          Logout
        </ButtonBase>
      </div>
    </div>
  );
};

interface IDropdownProps {
  isOpen: any;
  handleClose: any;
  onClick?: any;
  variant?: string;
  values?: any;
  selectedValue?: any;
  type?: string;
  children?: any;
}
const Dropdown = (props: IDropdownProps) => {
  const {
    isOpen,
    handleClose,
    onClick,
    variant,
    values,
    selectedValue,
    type,
    children,
  } = props;

  const preventDefault = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const closeDropdown = (e?: any) => {
    handleClose();

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return isOpen ? (
    variant === 'desktop' ? (
      <DropdownDesktopView
        preventDefault={preventDefault}
        closeDropdown={closeDropdown}
      />
    ) : (
      <DropdownView
        isOpen={isOpen}
        values={values}
        selectedValue={selectedValue}
        handleClick={onClick}
        preventDefault={preventDefault}
        type={type}
        closeDropdown={closeDropdown}
        children={children}
        variant={variant}
      />
    )
  ) : null;
};

export default Dropdown;
