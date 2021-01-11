import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import DropdownWrapper from '../dropdownWrapper/DropdownWrapper';
import { HeightHook } from 'bloben-common/utils/layout';
import BottomSheet from 'bottom-sheet-react';
import { Context } from '../../context/store';

/**
 * Filter all null items
 * @param childrenArray
 */
const filterNullChildren = (childrenArray: any) => {
  for (const item of childrenArray) {
    if (item !== null) {
      return item;
    }
  }
};

interface IBottomSheetDropdownSwitcherProps {
  children: any;
  handleClose: any;
  dropdownOffset: any;
  coordinates: any;
  setCoordinates: any;
}

/**
 * User for multiple BottomSheet components
 * @param props
 * @constructor
 */
const BottomSheetDropdownSwitcher = (props: IBottomSheetDropdownSwitcherProps) => {
  const {
    children,
    handleClose,
    dropdownOffset,
    coordinates,
    setCoordinates,
  } = props;

  const [store] = useContext(Context);

  const {isMobile, isDark} = store;

  const height: number = HeightHook();

  // Filter null children from wrapper or React Clone in BottomSheet crash
  const filteredChildren: any = filterNullChildren(children);

  return isMobile ? (
    <BottomSheet
        backdropClassName={isDark ? 'bottom-sheet__backdrop--dark' : ''}
        containerClassName={isDark ? 'bottom-sheet__container--dark' : ''}
      isExpandable={false}
      customHeight={(height / 4) * 2}
      onClose={handleClose}
    >
      {filteredChildren}
    </BottomSheet>
  ) : (
    <DropdownWrapper
      coordinates={coordinates}
      setCoordinates={setCoordinates}
      handleClose={handleClose}
      offset={dropdownOffset}
    >
      {filteredChildren}
    </DropdownWrapper>
  );
};

export default BottomSheetDropdownSwitcher;
