import { AxiosResponse } from 'axios';

import Axios from 'bloben-common/utils/axios';

const EMAIL_PATH_URL: string = 'email';

export interface IGetEmailDTO {
  email: string | null;
  isVerified: boolean | null;
}

const EmailApi = {
  /*
   * Get user's email
   */
  getEmail: async (): Promise<AxiosResponse> =>
     Axios.get(`/${EMAIL_PATH_URL}`)
};

export default EmailApi;
