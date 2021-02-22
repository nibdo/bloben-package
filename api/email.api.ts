import { AxiosResponse } from 'axios';

import Axios from 'bloben-common/utils/axios';

const EMAIL_PATH_URL: string = 'user/profile/email';

export interface IGetEmailDTO {
  email: string | null;
  isVerified: boolean | null;
}

const EmailApi = {
  /*
   * Get user's email
   */
  getEmail: async (): Promise<AxiosResponse> =>
     Axios.get(`/${EMAIL_PATH_URL}`),

  /**
   * Set user's email
   * @param email
   */
  setEmail: async (email: string): Promise<AxiosResponse> =>
      Axios.patch(`/${EMAIL_PATH_URL}`, {
        email
      }),

    /**
     * Delete user's email
     */
  deleteEmail: async (): Promise<AxiosResponse> =>
        Axios.delete(`/${EMAIL_PATH_URL}`)
};

export default EmailApi;
