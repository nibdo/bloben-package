import React, { useContext } from 'react';
import './Notifications.scss';
import MobileTitle from '../../components/title/Title';
import EvaIcons from '../../../bloben-common/components/eva-icons';
import { Context } from '../../context/store';
import HeaderModal from '../../components/headerModal/HeaderModal';
import { useSelector } from 'react-redux';
import ScrollView from '../../../bloben-common/components/scrollView/ScrollView';
import { parseCssDark } from '../../../bloben-common/utils/common';
import { ButtonBase } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const INVITE_TYPE: string = 'INVITE';




const getIconType = (notificationType: string, isDark: boolean): any => {
    const className: string = parseCssDark('svg-icon one-notification__icon', isDark)

    switch (notificationType) {
        case (INVITE_TYPE):
            return <EvaIcons.PersonAddIcon className={className} />
        default:
            return <div/>
    }
}

const getClickAction = (notification: INotification, history: any): any => {
    const {type, payload} = notification;

    switch (type) {
        case (INVITE_TYPE):
            return () => history.push(`/${payload.type}/${payload.id}`)
        default:
    }
}

interface INotification {
    id: string;
    body: string;
    type: string;
    parentId: string;
    parentTable: string;
    title: string;
    payload: any;
    createdAt: string;
    updatedAt: string;
    wasRead: boolean;
}

interface IOneNotificationProps {
    isDark: boolean;
    item: INotification;
}
const OneNotification = (props: IOneNotificationProps) => {
    const {isDark, item} = props;
    const {title, body, type, wasRead} = item;
    const history: any = useHistory();

    const icon: any = getIconType(type, isDark);
    const onClick: any = getClickAction(item, history);

    return <ButtonBase className={'one-notification__container'} onClick={onClick}>
        <div className={'one-notification__container-icon'}>
            {icon}
        </div>
        <div className={'one-notification__container-content'}>
            <p className={parseCssDark('one-notification__title', isDark)}>
                {title}
            </p>
            <p className={parseCssDark('one-notification__body', isDark)}>
                {body}
            </p>
        </div>
    </ButtonBase>
}

const renderNotifications = (data: any, isDark: boolean) =>
    data.map((item: INotification) =>
        <OneNotification item={item} isDark={isDark}/>)

const NotificationsView = () => {
    const [store] = useContext(Context);
    const { isDark } = store;

    const notifications: any = useSelector((state: any) => state.notifications);

    const renderedNotifications: any = renderNotifications(notifications, isDark);

    return (
    <div className={parseCssDark('column', isDark)}>
      <HeaderModal />
      <div className={'settings__container'}>
        <MobileTitle title={'Notifications'} />
        <ScrollView isDark={isDark}>
            {renderedNotifications}
        </ScrollView>
      </div>
    </div>
  );
};

const Notifications = () =>
  <NotificationsView />;

export default Notifications;
