import { AxiosResponse } from 'axios';

import Axios from '../../bloben-common/utils/axios';

const NOTIFICATIONS_PATH_URL: string = 'notifications';

const NotificationApi = {
    /**
     * Get notifications
     * @param lastSync
     */
    getNotifications: async (lastSync: string): Promise<AxiosResponse> =>
        Axios.get(`/${NOTIFICATIONS_PATH_URL}?lastSync=${lastSync}`),
    /**
     * Get notification by id
     * @param id
     */
    getNotificationById: async (id: string): Promise<AxiosResponse> =>
        Axios.get(`/${NOTIFICATIONS_PATH_URL}/${id}`),
};

export default NotificationApi;
