import React, { useContext } from 'react';
import './MyMenu.scss';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

import EvaIcons from 'bloben-common/components/eva-icons';
import { colorPalette } from '../../utils/common';
import { Context } from '../../context/store';

// TODO merge with Dropdown component

interface IMenuContentCheckProps {
  selected: any;
  select: any;
  data: any;
  handleClose: any;
}
const MenuContentCheck = (props: IMenuContentCheckProps) => {
  const { selected, select, data, handleClose } = props;

  const isDark: boolean = useSelector((state: any) => state.isDark);

  return data.map((item: any) => {
    const isChecked: boolean = selected.includes(item);

    const handleClick = () => {
      select(item);
      handleClose();
    };

    return (
      <div
        key={item.toString()}
        className={`my_menu__hovering${isDark ? '--dark' : ''}`}
      >
        <div className={'my_menu__row'} onClick={() => handleClick()}>
          <div
            className={`my_menu__container--icon${
              isChecked ? '--selected' : ''
            }${isDark ? '--dark' : ''}`}
          >
            <Checkbox
              checked={isChecked}
              onChange={() => handleClick()}
              value='checked'
            />
          </div>
          <div className={'my_menu__container--label'}>
            <p className={`my_menu__label${isDark ? '--dark' : ''}`}>
              {item}
            </p>
          </div>
        </div>
      </div>
    );
  });
};

interface IMenuContentRadioProps {
  selected: any;
  select: any;
  data: any;
  handleClose: any;
}
const MenuContentRadio = (props: IMenuContentRadioProps) => {
  const { selected, select, data, handleClose } = props;

  const isDark: boolean = useSelector((state: any) => state.isDark);

  return data.map((item: any) => {
    const handleClick = () => {
      select(item);
      handleClose();
    };
    const isSelected: boolean = selected && item.value === selected.value ? true : false;

    return (
      <div
        key={item.label}
        className={`my_menu__hovering${isDark ? '--dark' : ''}`}
      >
        <div className={'my_menu__row'} onClick={() => handleClick()}>
          <div
            className={`my_menu__container--icon${
              isSelected ? '--selected' : ''
            }${isDark ? '--dark' : ''}`}
          >
            {isSelected ? (
              <RadioButtonCheckedIcon className={'my_menu__icon'} />
            ) : (
              <RadioButtonUncheckedIcon className={'my_menu__icon'} />
            )}
          </div>
          <div className={'my_menu__container--label'}>
            <p className={`my_menu__label${isDark ? '--dark' : ''}`}>
              {item.label}
            </p>
          </div>
        </div>
      </div>
    );
  });
};

interface IMenuContentSimpleProps {
  data: any;
  handleClose: any;
}
const MenuContentSimple = (props: IMenuContentSimpleProps) => {
  const { data, handleClose } = props;

  const isDark: boolean = useSelector((state: any) => state.isDark);

  return data.map((item: any) => {
    const handleClick = () => {
      item.func();
      handleClose();
    };

    return item.path ? (
      <Link className={'my_menu__row'} to={item.path}>
        <div className={'my_menu__container--label'}>
          <p className={`my_menu__label${isDark ? '--dark' : ''}`}>
            {item.label}
          </p>
        </div>
      </Link>
    ) : (
      <div className={'my_menu__row'} onClick={handleClick}>
        <div className={'my_menu__container--label'}>
          <p className={`my_menu__label${isDark ? '--dark' : ''}`}>
            {item.label}
          </p>
        </div>
      </div>
    );
  });
};

interface IMenuContentCalendarProps {
  data: any;
  handleClose: any;
  select: any;
}
const MenuContentCalendar = (props: IMenuContentCalendarProps) => {
  const { select, data, handleClose } = props;

  const isDark: boolean = useSelector((state: any) => state.isDark);

  const preventDefault = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return data.map((item: any) => {
    const handleClick = () => {
      select(item);
      handleClose();
    };

    const calendarColor = colorPalette[item.color];

    return (
      <div
        key={item.toString()}
        onClick={preventDefault}
        className={`my_menu__hovering${isDark ? '--dark' : ''}`}
      >
        <div className={'my_menu__row'} onClick={() => handleClick()}>
          <div
            className={`my_menu__container--icon${isDark ? '--dark' : ''}`}
          >
            <EvaIcons.CircleFill
              className={'svg-icon calendar-content-svg'}
              fill={isDark ? calendarColor.dark : calendarColor.light}
            />
          </div>
          <div className={'my_menu__container--label'}>
            <p className={`my_menu__label${isDark ? '--dark' : ''}`}>
              {item.name}
            </p>
          </div>
        </div>
      </div>
    );
  });
};

interface IMyMenuProps {
  data: any;
  handleClose: any;
  select: any;
  variant: string;
  selected?: any;
}
const MyMenu = (props: IMyMenuProps) => {
  const [store] = useContext(Context);
  const { isDark } = store;

  const {
    data,
    variant,
    select,
    selected,
    handleClose,
  } = props;

  const preventDefault = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return  <div
        className={`my_menu__container${isDark ? '--dark' : ''}`}
        onClick={preventDefault}
      >
        {variant === 'simple' ? (
          <MenuContentSimple
            data={data}
            handleClose={handleClose}
          />
        ) : null}
        {variant === 'radio' ? (
          <MenuContentRadio
            data={data}
            select={select}
            selected={selected}
            handleClose={handleClose}
          />
        ) : null}
        {variant === 'calendar' ? (
          <MenuContentCalendar
            data={data}
            select={select}
            handleClose={handleClose}
          />
        ) : null}
        {variant === 'check' ? (
          <MenuContentCheck
            data={data}
            selected={selected}
            select={select}
            handleClose={handleClose}
          />
        ) : null}
      </div>
};

export default MyMenu;
