import React from 'react';
import './item-header.scss';
import { DATE_HOUR_FORMAT, formatDate } from '../../utils/date';

const ItemHeader = (props: any) => {
  const { item, mappedTags } = props;

  const formattedDate: string | null =
    item && item.updatedAt
      ? formatDate(item.updatedAt, DATE_HOUR_FORMAT)
      : null;

  return (
    <div className={'item-header__wrapper'}>
      <div className={'item-header__container-col'}>
        {/*<div className={'item-header__date-container'}>*/}
        {/*  {item && item.updatedAt ? (*/}
        {/*    <p className={'item-header__date-text'}>{formattedDate}</p>*/}
        {/*  ) : null}*/}
        {/*</div>*/}
        <div className={'item-header__tags-container'}></div>
      </div>
    </div>
  );
};

export default ItemHeader;
