import { AxiosResponse } from 'axios';

import Axios from 'bloben-common/utils/axios';
import { TSrpCredentialsForAuthType } from '../types/srp.types';
import { IPatchUpdate } from '../types/common.types';

const USER_PATH_URL: string = 'user';
export const APP_API_VERSION_1: string = '/v1';

const AccountApi = {
  /*
   * Get user's hash
   */
  getHash: async () => {
    const response: AxiosResponse = await Axios.get(`${APP_API_VERSION_1}/${USER_PATH_URL}/hash`);

    return response.data;
  },
  getChallenge: async (username: string) => {
    const response: AxiosResponse = await Axios.get(`${APP_API_VERSION_1}/${USER_PATH_URL}/challenge/?username=${username}`);

    return response;
  },
  exportAll: async () => {
    const response: AxiosResponse = await Axios.get(`${APP_API_VERSION_1}/${USER_PATH_URL}/export`);

    return response;
  },
  /*
   * Get user's services
   */
  getServices: async () => {
    const servicesData: AxiosResponse = await Axios.get(
      `${APP_API_VERSION_1}/${USER_PATH_URL}/services`
    );

    return servicesData.data;
  },
  /*
   * Get user data
   */
  getUserData: async (): Promise<AxiosResponse> => {
   return Axios.get(
        `${APP_API_VERSION_1}/${USER_PATH_URL}/account`
      );
  },
  /*
   * Get user profile
   */
  getUserProfile: async () =>
    Axios.get(
          `${APP_API_VERSION_1}/${USER_PATH_URL}/profile`),
  /*
   * Check if username is free
   */
  checkUsername: async (data: any): Promise<AxiosResponse> =>
    Axios.get(`${APP_API_VERSION_1}/${USER_PATH_URL}/username/${data.username}`),

  /*
   * Log in user
   */
  login: async (data: TSrpCredentialsForAuthType): Promise<AxiosResponse> => {
      return Axios.post(`${APP_API_VERSION_1}/${USER_PATH_URL}/login`, data);
  },

  /*
   * Logout user and delete session
   */
  logout: async () => Axios.post(`${APP_API_VERSION_1}/${USER_PATH_URL}/logout`),

  /*
 * Delete account
 */
  delete: async (data: TSrpCredentialsForAuthType): Promise<AxiosResponse> => {
    return Axios.delete(`${APP_API_VERSION_1}/${USER_PATH_URL}/delete`, data);
  },
  /**
   * Update user profile
   * @param data
   */
  updateProfile: async (data: IPatchUpdate): Promise<AxiosResponse> =>
      Axios.patch(`${APP_API_VERSION_1}/${USER_PATH_URL}/profile`, data),

};

export default AccountApi;
