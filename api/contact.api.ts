import { AxiosResponse } from 'axios';

import Axios from 'bloben-common/utils/axios';

const CONTACT_PATH_URL: string = 'contact';

const ContactApi = {
    /**
     * Create contact
     * @param data
     */
    createContact: async (data: any): Promise<AxiosResponse> =>
        Axios.post(`/${CONTACT_PATH_URL}`,
                   data),
    /*
 * Get user's conctacts
 */
    getContacts: async (): Promise<AxiosResponse> =>
        Axios.get(`/${CONTACT_PATH_URL}`),
    /*
* Get contact by id
*/
    getContactById: async (id: string): Promise<AxiosResponse> =>
        Axios.get(`/${CONTACT_PATH_URL}/${id}`),
};

export default ContactApi;
