import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import './NotificationSettings.scss';
import { ButtonBase, IconButton } from '@material-ui/core';
import EvaIcons from '../../../bloben-common/components/eva-icons';
import { HeightHook } from 'bloben-common/utils/layout';
import DropdownWrapper from '../dropdownWrapper/DropdownWrapper';
import ModalSmall from '../modalSmall/ModalSmall';
import { parseCssDark } from 'bloben-common/utils/common';
import Dropdown from '../dropdown/Dropdown';
import MyMenu from '../myMenu/MyMenu';
import BottomSheet from 'bottom-sheet-react';

const NOTIFICATIONS_MAX_LENGTH: number = 4;

const notificationSettings: any = [
  {
    label: 'on start',
    value: {
      reminderType: 'push',
      amount: 0,
      timeUnit: 'minutes',
    },
  },
  {
    label: '10 minutes before',
    value: {
      reminderType: 'push',
      amount: 10,
      timeUnit: 'minutes',
    },
  },
  {
    label: 'hour before',
    value: {
      reminderType: 'push',
      amount: 1,
      timeUnit: 'hours',
    },
  },
  {
    label: 'day before',
    value: {
      reminderType: 'push',
      amount: 1,
      timeUnit: 'days',
    },
  },
  { label: 'custom', value: 'custom' },
];

interface IRepeatValueDropdownProps {
  isOpen: any;
  label?: string;
  handleOpen: any;
  handleClose: any;
  handleSelect: any;
  value: any;
  values: any;
  style: any;
}
export const RepeatValueDropDown = (props: IRepeatValueDropdownProps) => {
  const {
    isOpen,
    label,
    handleOpen,
    handleClose,
    handleSelect,
    value,
    values,
    style,
  } = props;

  return (
    <div className={'repeat__value-wrapper'}>
      <p className={'repeat__value-label'}>{label}</p>
      <ButtonBase
        className={'repeat__value-container'}
        style={style}
        onClick={handleOpen}
      >
        <p className={'repeat__value-text'}>{value}</p>
        <Dropdown
          isOpen={isOpen}
          handleClose={handleClose}
          selectedValue={value}
          values={values}
          onClick={handleSelect}
          variant={'simple'}
        />
      </ButtonBase>
    </div>
  );
};

interface IRepeatValueInputProps {
  label?: string;
  onChange: any;
  defaultValue?: any;
  type: string;
  name: string;
  value: any;
  style: any;
}
export const RepeatValueInput = (props: IRepeatValueInputProps) => {
  const { label, defaultValue, type, name, value, onChange, style } = props;

  const isDark: boolean = useSelector((state: any) => state.isDark);

  return (
    <div className={'repeat__value-wrapper'}>
      <p className={'repeat__value-label'}>{label}</p>
      <input
        type={type}
        style={style}
        defaultValue={defaultValue}
        name={name}
        className={parseCssDark('repeat__value-container', isDark)}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

interface IRadioButtonProps {
  isSelected: boolean;
  isDark?: boolean;
  label: string;
  handleClick: any;
}
const RadioButton = (props: IRadioButtonProps) => {
  const { isSelected, isDark, label, handleClick } = props;

  return (
    <div className={'repeat__value-wrapper'}>
      <p className={'repeat__value-label'}>{label}</p>
      <IconButton onClick={handleClick}>
        {isSelected ? (
          <EvaIcons.RadioOn
            className={`svg-icon dropdown__icon-selected${
              isDark ? '-dark' : ''
            }`}
          />
        ) : (
          <EvaIcons.RadioOff
            className={`svg-icon dropdown__icon${isDark ? '-dark' : ''}`}
          />
        )}
      </IconButton>
    </div>
  );
};

interface ICustomNotificationOptionsProps {
  handleCloseCustomMenu: any;
  addNotification: any;
}
const CustomNotificationOptions = (props: ICustomNotificationOptionsProps) => {
  const { addNotification, handleCloseCustomMenu } = props;

  const defaultDropdownValue: any = {};

  const [valueIsOpen, openValue] = useState(defaultDropdownValue);
  const [value, setValue] = useState('hours');
  const [amount, setAmount] = useState(2);
  const [type, setType] = useState('push');

  const openDropdown = (e: any) => {
    const nativeEvent: any = e.nativeEvent;
    const { clientX, clientY } = nativeEvent;
    openValue({ clientX, clientY });
  };
  const closeDropdown = () =>
      openValue(defaultDropdownValue)

  const handleChange = (event: any) => {
    setAmount(event.target.value);
  };

  const handleValueSelect = (item: any) => {
    setValue(item);
    openValue(defaultDropdownValue);
  };

  const saveNotification = (): void => {
    addNotification({
      label: 'custom',
      value: { amount, reminderType: type, timeUnit: value },
    });
    handleCloseCustomMenu();
  };

  const valueOptions = ['minutes', 'hours', 'days', 'weeks'];

  return (
    <div className={'repeat__container'}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '50%', justifyContent: 'flex-end' }}>
          <h4 className={'repeat__subtitle'}>Custom notification</h4>
        </div>
        <div
          style={{ display: 'flex', width: '50%', justifyContent: 'flex-end' }}
        >
          <ButtonBase
            className={'button__container-small'}
            onClick={saveNotification}
          >
            Save
          </ButtonBase>
        </div>
      </div>
      <div className={'repeat__row'}>
        <RepeatValueInput
          style={{ width: 45 }}
          type={'number'}
          label={'Amount'}
          name={'amount'}
          value={amount}
          onChange={handleChange}
        />
        <div style={{ width: 25 }} />
        <RepeatValueDropDown
          label={'Frequency'}
          value={value}
          style={{ width: 80 }}
          handleOpen={openDropdown}
          handleClose={closeDropdown}
          values={valueOptions}
          handleSelect={handleValueSelect}
          isOpen={valueIsOpen.clientX ? true : null}
        />
      </div>
      <h4 className={'repeat__subtitle'}>Notify via</h4>
      <div className={'repeat__row'}>
        <RadioButton label={'Push'} isSelected={true} handleClick={() => {return}}/>
        <div style={{ width: 25 }} />
        {/*<RadioButton label={'Email'} isSelected={false} handleClick={() => {return}}/>*/}
      </div>
    </div>
  );
};

interface IAddNotificationItemProps {
  onClick: any;
}
const AddNotificationItem = (props: IAddNotificationItemProps) => {
  const { onClick } = props;

  const isDark: boolean = useSelector((state: any) => state.isDark);

  return (
    <div
      className={parseCssDark('event_detail__row no-row', isDark)}
      onClick={onClick}
    >
      <div className={'event_detail__container--icon'}>
        <EvaIcons.Bell className={'svg-icon event-content-svg'} />
      </div>
      <div className={'event_detail__button'} onClick={props.onClick}>
        <p className={parseCssDark('event_detail__input', isDark)}>
          Add notification
        </p>
      </div>
    </div>
  );
};

// TODO add custom notification text
const parseNotificationText = (amount: number, timeUnit: string): string => {
  switch (amount) {
    case 0:
      return 'on start';
    case 1:
      return `${timeUnit.slice(0, timeUnit.length - 1)} before`;
    default:
      return `${amount} ${timeUnit} before`;
  }
};

interface IOneNotificationProps {
  item: any;
  removeNotification: any;
}
const OneNotification = (props: IOneNotificationProps) => {
  const { item, removeNotification } = props;

  const isDark: boolean = useSelector((state: any) => state.isDark);

  const notificationText: string = parseNotificationText(
    item.amount,
    item.timeUnit
  );

  return (
    <div className={'event_detail__row no-row'}>
      <div className={'event_detail__container--icon'}>
        <EvaIcons.Bell className={'svg-icon event-content-svg-hidden'} />
      </div>
      <div className={'event_detail__sub-row'}>
        <div className={'event_detail__button'}>
          <p className={`event_detail__input${isDark ? '--dark' : ''}`}>
            {`${notificationText}`}
          </p>
        </div>
        <div className={'event_detail__button-right'}>
          <IconButton onClick={() => removeNotification(item)}>
            <EvaIcons.Cross className={'icon-svg'} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

const renderNotification = (data: any, removeNotification: any) =>
  data.map((item: any) => (
    <OneNotification
      key={item.id}
      item={item}
      removeNotification={removeNotification}
    />
  ));

interface INotificationsProps {
  notifications: any;
  removeNotification: any;
}
const Notifications = (props: INotificationsProps) => {
  const { notifications, removeNotification } = props;

  return renderNotification(
      notifications,
      removeNotification
  );
};

interface INotificationSettingsProps {
  anchor?: any;
  selected?: any;
  notifications: any;
  addNotification: any;
  removeNotification: any;
  coordinates: any;
  setCoordinates: any;
}
const NotificationSettings = (props: INotificationSettingsProps) => {
  const {
    selected,
    notifications,
    addNotification,
    removeNotification,
    coordinates,
    setCoordinates,
  } = props;

  const isMobile: boolean = useSelector((state: any) => state.isMobile);

  const height: number = HeightHook();

  const [menuIsOpen, openMenu] = useState(false);
  const [isCustomOpen, openCustomMenu] = useState(false);
  const noNewNotifications: boolean =
    notifications && notifications.length === NOTIFICATIONS_MAX_LENGTH;

  const parseSelectClick = (item: any) => {
    if (item.label === 'custom') {
      openCustomMenu(true);

      return;
    }

    addNotification(item);
  };

  const handleCloseMenu = (): void => openMenu(false);
  const handleCloseCustomMenu = (): void => openCustomMenu(false);

  return (
    <div className={'event_detail__wrapper-row'}>
      {!noNewNotifications ? (
        <AddNotificationItem
          onClick={() => {
            openMenu(true);
          }}
        />
      ) : null}
      {notifications && notifications.length > 0 ? (
        <Notifications
          notifications={notifications}
          removeNotification={removeNotification}
        />
      ) : null}
      {menuIsOpen ? (
        !isMobile ? (
          <DropdownWrapper
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            handleClose={handleCloseMenu}
          >
            <MyMenu
              variant={'radio'}
              select={parseSelectClick}
              selected={selected}
              handleClose={handleCloseMenu}
              data={notificationSettings}
            />
          </DropdownWrapper>
        ) : (
          <ModalSmall isOpen={menuIsOpen} handleClose={handleCloseMenu}>
            <MyMenu
              variant={"radio"}
              select={parseSelectClick}
              selected={selected}
              handleClose={handleCloseMenu}
              data={notificationSettings}
            />
          </ModalSmall>
        )
      ) : null}

      {isCustomOpen ? (
        <BottomSheet
          {...props}
          customHeight={(height / 4) * 2}
          isExpandable={false}
          onClose={handleCloseCustomMenu}
        >
          <CustomNotificationOptions
            addNotification={addNotification}
            handleCloseCustomMenu={handleCloseCustomMenu}
          />
        </BottomSheet>
      ) : null}
    </div>
  );
};

export default NotificationSettings;
