import React, { useContext, useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import './HeaderModal.scss';
import { useHistory } from 'react-router';
import TrashIcon from 'bloben-common/components/eva-icons/trash';
import EvaIcons from 'bloben-common/components/eva-icons';
import { Context } from '../../context/store';
const Icons = (props: any) => props.icons.map((icon: any) => icon);

interface IHeaderModalMobileProps {
  hasHeaderShadow?: boolean,
  goBack?: any,
  onDelete: any,
  handleFavourite: any,
  isFavourite: any,
  handleSave: any,
  handleEdit?: any,
  title?: string,
  icons: any;
}
// tslint:disable-next-line:cyclomatic-complexity
const HeaderModalMobile = (props: IHeaderModalMobileProps) => {
  const {
    hasHeaderShadow,
    goBack,
    onDelete,
    handleFavourite,
    isFavourite,
    handleSave,
    handleEdit,
    title,
    icons
  } = props;

  const [store] = useContext(Context);
  const {isDark, isMobile} = store;

  return (
    <div
      className={`header-modal__row${
        hasHeaderShadow && isMobile && !isDark ? '-shadow' : ''
      }${
          hasHeaderShadow && isMobile && isDark ? '-shadow-dark' : ''
      }
      `}
    >
      <div className={'header-modal__icon-left'}>
        {isMobile && goBack ? (
          <IconButton onClick={goBack}>
            <EvaIcons.ArrowBack className={`icon-svg${isDark ? '-dark' : ''}`} />
          </IconButton>
        ) : null}
      </div>
      <div className={'header-modal__container--title'}>
        <p className={`header-modal__title${isDark ? '-dark' : ''}`}>{title}</p>
      </div>
      <div className={'header-modal__container--icons'}>
        {handleSave ? (
            <IconButton onClick={handleSave}>
              <EvaIcons.Check className={`icon-svg-primary${isDark ? '-dark' : ''}`}/>
            </IconButton>
        ) : null
        }
        {onDelete ? (
          <IconButton onClick={onDelete}>
            <TrashIcon className={`icon-svg${isDark ? '-dark' : ''}`} />
          </IconButton>
        ) : null}
        {handleEdit ? (
            <IconButton onClick={handleEdit}>
              <EvaIcons.Edit className={`icon-svg-primary${isDark ? '-dark' : ''}`} />
            </IconButton>
        ) : null }
        {handleFavourite ? (
          <IconButton onClick={handleFavourite}>
            {isFavourite ? (
              <EvaIcons.StarFilled
                className={`icon-svg-primary${isDark ? '-dark' : ''}`}
              />
            ) : (
              <EvaIcons.Star className={`icon-svg${isDark ? '-dark' : ''}`} />
            )}
          </IconButton>
        ) : null}
        {icons ? <Icons icons={icons} /> : null}
      </div>
    </div>
  );
};

interface IHeaderModalViewProps {
  hasHeaderShadow?: boolean,
  goBack?: any,
  onDelete: any,
  handleFavourite: any,
  isFavourite: any,
  handleSave: any,
  handleEdit?: any,
  title?: string,
  icons: any;
  animation: string;
}
const HeaderModalView = (props: IHeaderModalViewProps) => {
  const {
    hasHeaderShadow,
    icons,
    goBack,
    onDelete,
    handleFavourite,
    isFavourite,
    handleSave,
    handleEdit,
    title,
    animation,
  } = props;

  const [store] = useContext(Context);
  const {isDark, isMobile} = store;

  return (
    <div
      className={`header-modal__wrapper${isDark ? '-dark' : ''} ${
        hasHeaderShadow && isMobile && !isDark ? 'with-shadow' : ''
      } ${animation}`}
    >
      <div className={'header-modal__row'}>
        <HeaderModalMobile
          icons={icons}
          hasHeaderShadow={hasHeaderShadow}
          goBack={goBack}
          onDelete={onDelete}
          handleFavourite={handleFavourite}
          isFavourite={isFavourite}
          handleSave={handleSave}
          handleEdit={handleEdit}
          title={title}
        />
      </div>
    </div>
  );
};

interface IHeaderModalProps {
  hasHeaderShadow?: boolean;
  icons?: any;
  handleDelete?: any;
  handleEdit?: any;
  handleFavourite?: any;
  isFavourite?: boolean;
  handleSave?: any;
  title?: string;
  onClose?: any;
  absolute?: boolean;
}
const HeaderModal = (props: IHeaderModalProps) => {
  const {
    hasHeaderShadow,
    icons,
    handleDelete,
    handleFavourite,
    isFavourite,
    handleSave,
    handleEdit,
    title,
    onClose,
    absolute
  } = props;

  const [animation, setAnimation] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (hasHeaderShadow) {
      setAnimation('header-modal__text-visible');
    } else {
      setAnimation('header-modal__text-hidden');
    }
  },        [hasHeaderShadow]);

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      history.goBack();
    }
  };

  const onDelete = () => {
    handleDelete();
  };

  return (
     <HeaderModalView
      hasHeaderShadow={hasHeaderShadow}
      icons={icons}
      goBack={absolute ? null : handleClose}
      onDelete={handleDelete ? onDelete : null}
      handleFavourite={handleFavourite}
      isFavourite={isFavourite}
      handleSave={handleSave}
      handleEdit={handleEdit}
      title={title}
      animation={animation}
    />
  );
};

export default HeaderModal;
