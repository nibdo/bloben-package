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

const getIconType = (notificationType: string, isDark: boolean): any => {
    const className: string = parseCssDark('svg-icon one-notification__icon', isDark)

    switch (notificationType) {
        case ('invite'):
            return <EvaIcons.PersonAddIcon className={className} />
        default:
            return <div/>
    }
}

interface INotification {
    id: string;
    body: string;
    notificationType: string;
    parentId: string;
    parentTable: string;
    title: string;
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
    const {title, body, notificationType, wasRead} = item;

    const icon: any = getIconType(notificationType, isDark);

    return <ButtonBase className={'one-notification__container'}>
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
    console.log(notifications)

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
