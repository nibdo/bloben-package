import { AxiosResponse } from 'axios';

import Axios from 'bloben-common/utils/axios';
import { TSrpCredentialsForAuthType } from '../types/srp.types';

const USER_PATH_URL: string = 'user';

type checkUsernameType = { username: string };

const AccountApi = {
  /*
   * Get user's hash
   */
  getHash: async () => {
    const response: AxiosResponse = await Axios.get(`/${USER_PATH_URL}/hash`);

    return response.data;
  },
  getChallenge: async (username: string) => {
    const response: AxiosResponse = await Axios.get(`/${USER_PATH_URL}/challenge/?username=${username}`);

    return response;
  },
  exportAll: async () => {
    const response: AxiosResponse = await Axios.get(`/${USER_PATH_URL}/export`);

    return response;
  },
  /*
   * Get user's services
   */
  getServices: async () => {
    const servicesData: AxiosResponse = await Axios.get(
      `/${USER_PATH_URL}/services`
    );

    return servicesData.data;
  },
  /*
   * Get user data
   */
  getUserData: async () => {
    try {
      const userData: AxiosResponse = await Axios.get(
        `/${USER_PATH_URL}/account`
      );

      return userData.data;
    } catch (err) {
      return err;
    }
  },

  /*
   * Check if username is free
   */
  checkUsername: async (data: checkUsernameType): Promise<AxiosResponse> =>
    Axios.post(`/${USER_PATH_URL}/check-username`, data),

  /*
   * Log in user
   */
  login: async (data: TSrpCredentialsForAuthType): Promise<AxiosResponse> => {
      return Axios.post(`/${USER_PATH_URL}/login`, data);
  },

  /*
   * Logout user and delete session
   */
  logout: async () => Axios.post(`/${USER_PATH_URL}/logout`),

  /*
 * Delete account
 */
  delete: async (data: TSrpCredentialsForAuthType): Promise<AxiosResponse> => {
    return Axios.delete(`/${USER_PATH_URL}/delete`, data);
  },
};

export default AccountApi;
