import React, { useContext } from 'react';
import { ButtonBase, Switch } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { capitalStart } from '../../utils/common';
import './SettingsItem.scss';
import { Context } from '../../context/store';
import { parseCssDark } from '../../../bloben-common/utils/common';

interface IButtonItemProps {
  title: string;
  description?: string;
  icon: any;
  value?: string;
  toogle?: any;
  onClick?: any;
}
const ButtonItem = (props: IButtonItemProps) => {
  const { title, description, icon, value, toogle, onClick } = props;

  const [store] = useContext(Context);

  const {isDark} = store;

  const valueFormatted: string | null = toogle ? null : capitalStart(value);

  return (
    <div className={'settings-item__container'}>
      {icon}
      <div className={'settings-item__text-container'}>
        <p className={parseCssDark('settings-item__title', isDark)}>
          {title}
        </p>
        {description ? (
          <p className={parseCssDark('settings-item__description', isDark)}>
            {description}
          </p>
        ) : null}
      </div>
      {value && !toogle ? (
        <div className={'settings-item__value-container'}>
          <p className={parseCssDark('settings-item__value', isDark)}>
            {valueFormatted}
          </p>
        </div>
      ) : null}
      {toogle ? (
        <div className={'settings-item__value-container'}>
          <div className={parseCssDark('settings-item__value', isDark)}>
            <Switch
              checked={!!value}
              onChange={onClick}
              color={'primary'}
              name={'checked'}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

interface ISettingsItemProps {
  link?: string;
  onClick?: any;
  title: string;
  icon: any;
  toogle?: any;
  description?: string;
}
const SettingsItem = (props: ISettingsItemProps) => {
  const { link, onClick } = props;
  const history = useHistory();

  const navigateTo = () => {
    history.push(`/settings/${link}`);
  };

  return (
    <ButtonBase
      className={'settings-item__wrapper'}
      onClick={onClick ? onClick : navigateTo}
    >
      <ButtonItem {...props} />
    </ButtonBase>
  );
};

export default SettingsItem;
