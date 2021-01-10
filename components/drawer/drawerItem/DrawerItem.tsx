import React from 'react';
import { useSelector } from 'react-redux';
import ButtonBase from '@material-ui/core/ButtonBase';

import './DrawerItem.scss';
import { NO_TIMEOUT, TIMEOUT_LONG } from '../../../utils/common';
import EvaIcons from 'bloben-common/components/eva-icons';

interface IItem {
  id: string;
  name: string;
}
interface IDrawerItemViewProps {
  item: IItem;
  isSelected: boolean;
  selectItem: any;
}

const DrawerItemView = (props: IDrawerItemViewProps) => {
  const { item, isSelected, selectItem } = props;
  const { id, name } = item;

  const isDark: boolean = useSelector((state: any) => state.isDark);
  const isMobile: boolean = useSelector((state: any) => state.isMobile);

  return (
    <ButtonBase
      className={`drawer-item__container ${
        isSelected ? 'drawer-item__container--selected' : ''
      }${isDark ? '-dark' : ''}`}
      onClick={() => selectItem(id)}
    >
      {!isMobile ? (
        <EvaIcons.Hash className={'svg-icon drawer-item-icon'} />
      ) : null}
      <p
        className={`drawer-item__title${isDark ? '-dark' : ''} ${
          isSelected ? 'drawer-item__title--selected' : ''
        }${isDark ? '-dark' : ''}`}
      >
        {name}
      </p>
    </ButtonBase>
  );
};

interface IDrawerItemProps {
  item: IItem;
  selectItem: any;
  selectedItem: any;
}
const DrawerItem = (props: IDrawerItemProps) => {
  const {
    item,
    selectedItem,
    selectItem,
  } = props;

  const isSelected: boolean = selectedItem?.id === item.id;
  const isMobile: boolean = useSelector((state: any) => state.isMobile);

  const onSelect = () => {
      setTimeout(() => selectItem(item), isMobile ? TIMEOUT_LONG : NO_TIMEOUT);
  };

  return (
    <DrawerItemView
      item={item}
      isSelected={isSelected}
      selectItem={onSelect}
    />
  );
};

export default DrawerItem;
