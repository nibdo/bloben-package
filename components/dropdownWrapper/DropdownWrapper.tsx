import React, { useState } from 'react';
import { useHistory } from 'react-router';
import './DropdownWrapper.scss';

interface IDropdownWrapperProps {
  children: any;
  handleClose: any;
  coordinates: any;
  setCoordinates: any;
  offset?: string;
}

const DropdownWrapper = (props: IDropdownWrapperProps) => {
  const { children, handleClose, coordinates, setCoordinates, offset = 'bottomRight' } = props;
  const history = useHistory();

  const [fixedCoordinates, setFixedCoordinates] = useState({x: null, y: null})

  const preventDefault = (e: any): void => {
    e.preventDefault();
    e.stopPropagation();
  };
  const goBack = (e: any) => {
    preventDefault(e)
    setCoordinates({x: 0, y: 0})

    if (handleClose) {
      handleClose();
    } else {
      history.goBack();
    }
  };

  const parseAnchorStyle = () => {

    const OFFSET_DOWN: number = 35;
    const OFFSET_LEFT: number = 5;

    // Missing props, return to prevent re-render loop
    if (!coordinates.x || !coordinates.y) {
      return;
    }

    const {x, y} = fixedCoordinates;

    let top: number | null = 0;
    let left: number | null = 0;

    // Firstly set coordinates from props
    if (!fixedCoordinates.x || !fixedCoordinates.y) {
      top = coordinates.y;
      left = coordinates.x;
      // Fix coordinates to prevent changes from click listener
      setFixedCoordinates({x: coordinates.x, y: coordinates.y})
    } else {
      top = y;
      left = x;
    }

    if (!top || !left) {
      return;
    }

    switch (offset) {
      case 'bottomRight':
        top = top + OFFSET_DOWN;
        left = left + OFFSET_LEFT;
        break;
      case 'bottom':
        top = top + OFFSET_DOWN;
        break;
        default:
    }

    return {top, left}
  }

  const containerStyle: any = parseAnchorStyle();

  return (
     <div className={'dropdown__wrapper-new'} onClick={goBack}>
       <div className={'dropdown__container-new'} style={containerStyle} onClick={preventDefault}>
         {children}
     </div>
     </div>
  );
};

export default DropdownWrapper;
