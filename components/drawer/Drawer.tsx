import React from 'react';
import { useHistory } from 'react-router';
import { ButtonBase } from '@material-ui/core';
import { useSelector } from 'react-redux';

import DrawerItem from './drawerItem/DrawerItem';
import './Drawer.scss';

const renderItems = (
  data: any[],
  selectedItem: any,
  selectItem: any,
) => {
  return data.map((item: any) => {
                    if (!item.deletedAt) {
                      return <DrawerItem
                          key={item.id}
                          item={item}
                          selectedItem={selectedItem}
                          selectItem={selectItem}
                      />
                    }
                  }
  );
};

interface IDrawerDesktopProps {
  isDark?: boolean;
  title?: string;
}
const DrawerDesktop = (props: IDrawerDesktopProps) => {
  const { isDark, title } = props;

  return (
    <div className={'drawer__header'}>
      <h5 className={`drawer__title${isDark ? '-dark' : ''}`}>{title}</h5>
    </div>
  );
};

interface IDrawerViewProps {
  title?: string;
  data: any;
  selectItem: any;
  selectedItem: any;
  addButtonText?: string;
  openNewItem: any;
}
const DrawerView = (props: IDrawerViewProps) => {
  const {
    data,
    title,
    selectedItem,
    selectItem,
    addButtonText,
    openNewItem
  } = props;

  const isDark: boolean = useSelector((state: any) => state.isDark);
  const isMobile: boolean = useSelector((state: any) => state.isMobile);

  const items = renderItems(data, selectedItem, selectItem);

  return (
    <div className={`drawer__wrapper${isDark ? '-dark' : ''}`}>
      {isMobile ? null : (
        <DrawerDesktop
          isDark={isDark}
          title={title}
        />
      )}
      <div className={'drawer__container'}>
        <ButtonBase
          className={'drawer__button-desktop'}
          onClick={openNewItem}
          title={addButtonText}
        />
        {items}
      </div>
    </div>
  );
};

interface IDrawerProps {
  title?: string;
  data: any;
  selectItem: any;
  selectedItem: any;
  handleCloseModal: any;
  addButtonText?: string;
  addItemPath: string;
}
const Drawer = (props: IDrawerProps) => {
  const history = useHistory();

  const {
    title,
    data,
    selectItem,
    handleCloseModal,
    addButtonText,
    addItemPath,
    selectedItem
  } = props;

  const openNewItem = () => {
    if (handleCloseModal) {
      handleCloseModal();
    }
    history.push(addItemPath);
  };

  return (
    <DrawerView
      selectedItem={selectedItem}
      title={title}
      data={data}
      addButtonText={addButtonText}
      selectItem={selectItem}
      openNewItem={openNewItem}
    />
  );
};

export default Drawer;
